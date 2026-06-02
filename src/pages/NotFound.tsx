import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Wrench, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <Helmet>
        <title>Page Not Found | NearMobileRepair</title>
      </Helmet>

      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto shadow-lg border border-blue-100">
          <Wrench size={52} className="text-blue-600" style={{ transform: "rotate(-20deg)" }} />
        </div>
        <span className="absolute -top-3 -right-3 text-4xl animate-bounce">🔧</span>
      </div>

      <h1 className="text-6xl font-black text-slate-900 mb-3">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Page Not Found</h2>
      <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
        Looks like this page got broken — just like a cracked screen! Let us take you back to safety.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.02]"
        >
          <Home size={18} /> Go to Homepage
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold px-6 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>

      <p className="mt-10 text-sm text-slate-400">
        Need repair help?{" "}
        <a href="https://wa.me/919974221322" className="text-blue-600 font-bold hover:underline">
          WhatsApp us
        </a>
      </p>
    </div>
  );
}
