import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface AuthUser {
  name: string;
  mobile: string;
  email?: string;
  uid?: string;
  createdAt: string;
}

const USERS_KEY = "nmr_users";
const SESSION_KEY = "nmr_session";

function getUsers(): Record<string, AuthUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, AuthUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function syncUser(user: AuthUser) {
  if (!user.uid && !user.mobile) return; // need an ID
  const id = user.uid || user.mobile;
  try {
    await setDoc(doc(db, "users", id), user, { merge: true });
  } catch (err) {
    console.error("Failed to sync user to Firestore", err);
  }
}

// Keep standard register/login for backward compatibility or future use
export function register(name: string, mobile: string): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users[mobile]) {
    return { ok: false, error: "Mobile number already registered. Please login." };
  }
  const user = { name, mobile, createdAt: new Date().toISOString() };
  users[mobile] = user;
  saveUsers(users);
  syncUser(user);
  localStorage.setItem(SESSION_KEY, mobile);
  return { ok: true };
}

export function login(mobile: string): { ok: boolean; error?: string; user?: AuthUser } {
  const users = getUsers();
  const user = users[mobile];
  if (!user) {
    return { ok: false, error: "Mobile number not registered. Please register first." };
  }
  localStorage.setItem(SESSION_KEY, mobile);
  return { ok: true, user };
}

// New Google Login handler
export function saveGoogleUser(name: string, email: string, uid: string) {
  const users = getUsers();
  // If user already exists by UID, just update session. If not, create them.
  if (!users[uid]) {
    const user = { name, mobile: "", email, uid, createdAt: new Date().toISOString() };
    users[uid] = user;
    saveUsers(users);
    syncUser(user);
  }
  localStorage.setItem(SESSION_KEY, uid);
}

// Allow updating mobile for Google users
export function updateMobile(uid: string, mobile: string) {
  const users = getUsers();
  if (users[uid]) {
    users[uid].mobile = mobile;
    saveUsers(users);
    syncUser(users[uid]);
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): AuthUser | null {
  try {
    const key = localStorage.getItem(SESSION_KEY);
    if (!key) return null;
    const users = getUsers();
    return users[key] || null;
  } catch {
    return null;
  }
}

export function getAllUsers(): AuthUser[] {
  const users = getUsers();
  return Object.values(users);
}
