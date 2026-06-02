import { Phone, Smartphone, Wrench, Menu, X, UserCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const { user, openAuth, doLogout } = useAuth();

  const isHome = location.pathname === "/";

  const navLinks = [
    { name: "Services", href: "/#services" },
    { name: "Brands", href: "/#brands" },
    { name: "Reviews", href: "/#reviews" },
    { name: "FAQ", href: "/#faq" },
    { name: "Track Status", href: "/status" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Smartphone size={20} className="relative z-10 -ml-1 group-hover:rotate-12 transition-transform duration-300" />
              <Wrench size={14} className="absolute bottom-2 right-2 text-blue-500 group-hover:-rotate-45 group-hover:text-blue-400 transition-all duration-300 origin-bottom-left" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
              NearMobile<span className="text-blue-600 group-hover:text-slate-900 transition-colors">Repair</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors"
                >
                  <UserCircle size={18} />
                  {user.name.split(" ")[0]}
                </button>
                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">+91 {user.mobile}</p>
                      </div>
                      <Link
                        to="/status"
                        onClick={() => setUserDropdown(false)}
                        className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        My Bookings
                      </Link>
                      <button
                        onClick={() => { doLogout(); setUserDropdown(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth("login")}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-100 shadow-xl"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-800 font-medium text-lg px-2 py-1"
                >
                  {link.name}
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="bg-blue-50 rounded-xl px-4 py-3">
                      <p className="text-xs text-blue-400 font-medium">Logged in as</p>
                      <p className="font-bold text-blue-900">{user.name}</p>
                    </div>
                    <button
                      onClick={() => { doLogout(); setIsOpen(false); }}
                      className="bg-slate-100 text-red-500 text-center py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { openAuth("register"); setIsOpen(false); }}
                      className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold shadow-lg shadow-blue-200"
                    >
                      Register / Login
                    </button>
                  </>
                )}
                <a
                  href="tel:+919974221322"
                  className="bg-slate-100 text-slate-900 text-center py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                >
                  <Phone size={18} />
                  Call Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
