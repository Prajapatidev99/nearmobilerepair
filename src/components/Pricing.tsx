import { CheckCircle2, Smartphone, Battery, Zap, Camera, Volume2, Settings } from "lucide-react";
import { motion } from "motion/react";

const pricingPlans = [
  {
    icon: <Smartphone size={28} className="text-blue-600" />,
    service: "Display Replacement",
    desc: "High-quality OEM combo with warranty. Warranty only if warranty combo is selected.",
    ranges: [
      { brand: "Apple iPhone", price: "₹1,500 – ₹5,500" },
      { brand: "Samsung", price: "₹800 – ₹3,500" },
      { brand: "OnePlus", price: "₹1,200 – ₹3,000" },
      { brand: "Others", price: "₹500 – ₹1,800" },
    ],
    popular: true,
    badge: "Most Popular",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    icon: <Battery size={28} className="text-emerald-600" />,
    service: "Battery Replacement",
    desc: "Original capacity batteries — 6-month warranty included on all batteries.",
    ranges: [
      { brand: "Apple iPhone", price: "₹1,200 – ₹2,500" },
      { brand: "Samsung", price: "₹499 – ₹1,200" },
      { brand: "OnePlus", price: "₹499 – ₹999" },
      { brand: "Others", price: "₹399 – ₹799" },
    ],
    popular: false,
    badge: "Best Value",
    badgeColor: "bg-emerald-500 text-white",
  },
  {
    icon: <Zap size={28} className="text-amber-600" />,
    service: "Charging Port",
    desc: "Fix loose or dead charging ports",
    ranges: [
      { brand: "All Brands", price: "₹299 – ₹799" },
    ],
    popular: false,
    badge: "",
    badgeColor: "",
  },
  {
    icon: <Camera size={28} className="text-purple-600" />,
    service: "Camera Repair",
    desc: "Front & back camera fixes",
    ranges: [
      { brand: "All Brands", price: "₹499 – ₹1,500" },
    ],
    popular: false,
    badge: "",
    badgeColor: "",
  },
  {
    icon: <Volume2 size={28} className="text-pink-600" />,
    service: "Speaker / Mic",
    desc: "Clear audio restoration for calls",
    ranges: [
      { brand: "All Brands", price: "₹249 – ₹699" },
    ],
    popular: false,
    badge: "",
    badgeColor: "",
  },
  {
    icon: <Settings size={28} className="text-slate-600" />,
    service: "Software Issues",
    desc: "Bootloop, OS fixes, data recovery",
    ranges: [
      { brand: "All Brands", price: "₹199 – ₹599" },
    ],
    popular: false,
    badge: "",
    badgeColor: "",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest mb-4">
            Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Repair Cost Estimates
          </h2>
          <p className="text-lg text-slate-500">
            No hidden charges. You pay only after the repair is done to your satisfaction.
          </p>
        </div>

        {/* Trust note */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm font-medium text-slate-600">
          {["✅ No visiting charge", "✅ Pay after repair", "✅ 6-month battery warranty", "✅ Warranty combo available for screens"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-[28px] border p-7 shadow-sm hover:shadow-xl transition-all relative overflow-hidden ${
                plan.popular ? "border-blue-200 ring-2 ring-blue-100" : "border-slate-100"
              }`}
            >
              {plan.badge && (
                <span className={`absolute top-5 right-5 text-xs font-black px-3 py-1 rounded-full ${plan.badgeColor}`}>
                  {plan.badge}
                </span>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                plan.popular ? "bg-blue-50" : "bg-slate-50"
              }`}>
                {plan.icon}
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{plan.service}</h3>
              <p className="text-sm text-slate-500 mb-5">{plan.desc}</p>

              <div className="space-y-2.5">
                {plan.ranges.map((r, j) => (
                  <div key={j} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-600 font-medium">{r.brand}</span>
                    <span className="text-sm font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-full">{r.price}</span>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/919974221322?text=${encodeURIComponent(`Hi, I'd like to know the price for ${plan.service}. Please share the exact quote.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all bg-slate-900 text-white hover:bg-black"
              >
                Get Exact Quote
              </a>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          * Prices are estimates. Final price depends on model and part quality chosen. No charge if repair is not possible.
        </p>
      </div>
    </section>
  );
}
