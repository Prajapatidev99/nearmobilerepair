import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthUser, getCurrentUser, saveGoogleUser, logout } from "../lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  openAuth: () => void;
  closeAuth: () => void;
  doLogout: () => void;
  refreshUser: () => void;
  isAuthOpen: boolean;
  authMode: "login" | "register";
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  openAuth: () => {},
  closeAuth: () => {},
  doLogout: () => {},
  refreshUser: () => {},
  isAuthOpen: false,
  authMode: "login",
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const refreshUser = () => {
    setUser(getCurrentUser());
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const openAuth = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };
  const closeAuth = () => setIsAuthOpen(false);

  const doLogout = () => {
    logout();
    setUser(null);
  };

  const handleGoogleSuccess = (name: string, email: string, uid: string) => {
    saveGoogleUser(name, email, uid);
    refreshUser();
    setIsAuthOpen(false);
  };

  return (
    <AuthContext.Provider value={{ user, openAuth, closeAuth, doLogout, refreshUser, isAuthOpen, authMode }}>
      {children}
      {isAuthOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onSuccess={handleGoogleSuccess}
          onClose={closeAuth}
        />
      )}
    </AuthContext.Provider>
  );
}

function AuthModal({
  mode,
  setMode,
  onSuccess,
  onClose,
}: {
  mode: "login" | "register";
  setMode: (m: "login" | "register") => void;
  onSuccess: (name: string, email: string, uid: string) => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        if (!name.trim()) {
          setLoading(false);
          return setError("Please enter your full name.");
        }
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(result.user, { displayName: name.trim() });
        onSuccess(name.trim(), result.user.email || email.trim(), result.user.uid);
      } else {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        onSuccess(result.user.displayName || "User", result.user.email || email.trim(), result.user.uid);
      }
    } catch (err: any) {
      console.error("Email auth error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already registered. Please login.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      onSuccess(user.displayName || "User", user.email || "", user.uid);
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-black">N</div>
          <span className="font-black text-lg text-slate-900">NearMobile<span className="text-blue-600">Repair</span></span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
          {mode === "login" ? "Welcome back 👋" : "Create account"}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {mode === "login" ? "Sign in to book and track your repairs." : "Register quickly to book your first repair."}
        </p>

        {error && (
          <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl border border-red-100 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
          {mode === "register" && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 focus:bg-white transition text-sm" />
            </div>
          )}
          
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 focus:bg-white transition text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 focus:bg-white transition text-sm" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
            {loading ? "Please wait..." : (mode === "login" ? "Login with Email" : "Register with Email")}
          </button>
        </form>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-bold rounded-xl shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-3"
        >
          {loading ? (
            <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          {mode === "login" ? (
            <>Don't have an account? <button type="button" onClick={() => { setMode("register"); setError(""); }} className="text-blue-600 font-bold hover:underline">Register</button></>
          ) : (
            <>Already registered? <button type="button" onClick={() => { setMode("login"); setError(""); }} className="text-blue-600 font-bold hover:underline">Login</button></>
          )}
        </p>
      </div>
    </div>
  );
}
