import { Smartphone, Battery, Zap, Volume2, Camera, Settings } from "lucide-react";
import { motion } from "motion/react";

export default function Services() {
  const services = [
    {
      icon: <Smartphone size={28} className="text-blue-600" />,
      title: "Display Replacement",
      desc: "High-quality combo replacements with warranty.",
      from: "₹999",
      color: "bg-blue-50",
    },
    {
      icon: <Battery size={28} className="text-emerald-600" />,
      title: "Battery Replacement",
      desc: "Original capacity batteries to restore battery life.",
      from: "₹799",
      color: "bg-emerald-50",
    },
    {
      icon: <Zap size={28} className="text-amber-600" />,
      title: "Charging Repair",
      desc: "Fix charging port and logic board charging issues.",
      from: "₹299",
      color: "bg-amber-50",
    },
    {
      icon: <Camera size={28} className="text-purple-600" />,
      title: "Camera Repair",
      desc: "Front and back camera fixes for blurry or broken lenses.",
      from: "₹499",
      color: "bg-purple-50",
    },
    {
      icon: <Volume2 size={28} className="text-pink-600" />,
      title: "Speaker / Mic",
      desc: "Clear audio restoration for calls and media.",
      from: "₹249",
      color: "bg-pink-50",
    },
    {
      icon: <Settings size={28} className="text-slate-600" />,
      title: "Software Issues",
      desc: "Bootloop, logo stuck, and OS re-installation.",
      from: "₹199",
      color: "bg-slate-100",
    },
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Premium Repair Services
          </h2>
          <p className="text-lg text-slate-500">
            We fix all major issues at your doorstep. Transparent pricing and genuine parts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover="hover"
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg transition-shadow group"
            >
              <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300`}>
                <motion.div
                  className="transition-colors"
                  variants={{
                    hover: {
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {service.icon}
                </motion.div>
              </div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                <span className="text-xs font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                  From {service.from}
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-md"
          >
            View Full Pricing →
          </a>
        </div>
      </div>
    </section>
  );
}
