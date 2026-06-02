import { Smartphone, Wrench, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                <Smartphone size={20} className="relative z-10 -ml-1" />
                <Wrench size={14} className="absolute bottom-2 right-2 text-blue-500" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900">
                NearMobile<span className="text-blue-600">Repair</span>
              </span>
            </div>
            <p className="text-slate-600 max-w-sm mb-8 leading-relaxed">
              Ahmedabad's most trusted doorstep mobile repair service. Certified technicians, transparent pricing, and genuine parts.
            </p>
            <div className="flex flex-col gap-4">
              <a href="tel:+919974221322" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100"><Phone size={18} /></div>
                <span className="font-bold">+91 9974221322</span>
              </a>
              <a
                href="https://wa.me/919974221322"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                  <img src="https://cdn.simpleicons.org/whatsapp/16a34a" width="18" height="18" alt="WhatsApp" />
                </div>
                <span className="font-bold">WhatsApp Us</span>
              </a>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100"><MapPin size={18} /></div>
                <span className="font-medium">Serving all across Ahmedabad, Gujarat</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Services</h4>
            <ul className="space-y-4">
              {[
                { label: "Display Replacement", href: "/#services" },
                { label: "Battery Change", href: "/#services" },
                { label: "Charging Port", href: "/#services" },
                { label: "Camera Repair", href: "/#services" },
                { label: "Software Fixes", href: "/#services" },
                { label: "Pricing", href: "/#pricing" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/status" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Track My Repair</Link></li>
              <li><a href="/#faq" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">FAQ</a></li>
              <li><a href="/#reviews" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Reviews</a></li>
              <li>
                <a
                  href={`https://wa.me/919974221322?text=${encodeURIComponent("Hi, I have a query about your repair service.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} NearMobileRepair Ahmedabad. All rights reserved.</p>
          <p className="text-xs text-slate-400">
            Made with ❤️ for Amdavadis
          </p>
        </div>
      </div>
    </footer>
  );
}
