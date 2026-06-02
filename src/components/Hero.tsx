import { ArrowRight, ShieldCheck, Clock, Wrench } from "lucide-react";
import { motion } from "motion/react";
import BookingForm from "./BookingForm";

export default function Hero() {
  const trustFeatures = [
    { icon: <Clock size={20} className="text-blue-600" />, text: "Same Day Service" },
    { icon: <ShieldCheck size={20} className="text-blue-600" />, text: "Warranty Included" },
    { icon: <Wrench size={20} className="text-blue-600" />, text: "Genuine Parts" },
  ];

  return (
    <section id="book" className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Technicians Available Now
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Doorstep Mobile Repair <br /><span className="text-blue-600">At Your Home.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-8 leading-relaxed max-w-lg">
            Combo & Battery Replacement at Your Home by Trusted Technicians. Professional service with a transparent process.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {/* Fix: scroll to the booking form instead of looping to #book */}
            <button
              onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
            >
              Book Repair Online
              <ArrowRight size={18} />
            </button>
            {/* WhatsApp button with real icon */}
            <a
              href="https://wa.me/919974221322"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-3.5 px-8 rounded-xl transition-colors w-full sm:w-auto border border-emerald-100"
            >
              <img src="https://cdn.simpleicons.org/whatsapp/059669" width="20" height="20" alt="WhatsApp" />
              WhatsApp Now
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trustFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  {feature.icon}
                </div>
                <span className="text-sm font-bold text-slate-900 leading-tight mt-1.5">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="booking-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex items-center justify-center lg:justify-end"
        >
          <BookingForm />
        </motion.div>
      </div>
    </section>
  );
}
