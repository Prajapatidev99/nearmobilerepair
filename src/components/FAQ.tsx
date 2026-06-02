import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How long does a doorstep repair take?",
      a: "Most repairs, like screen and battery replacements, take about 30 to 45 minutes right in front of you."
    },
    {
      q: "Do you provide a warranty on parts?",
      a: "Yes, we provide up to 6 months warranty on our replaced parts depending on the component. We provide 6 months warranty on batteries, while display (combo) warranty depends on whether the customer chooses a warranty combo or a normal combo."
    },
    {
      q: "Is there any visiting charge?",
      a: "No, we don't have a visiting charge if you decide to go ahead with the repair."
    },
    {
      q: "Is it safe to repair at home?",
      a: "Absolutely. Our technicians are background-verified and repair the device right in front of you, ensuring your data privacy."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <Minus className="text-blue-600 flex-shrink-0" size={20} />
                ) : (
                  <Plus className="text-slate-400 flex-shrink-0" size={20} />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                      <div className="pt-4">{faq.a}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
