import { Truck, Clock, ShieldCheck, Lock, MessageCircle, Receipt, Percent, Users, Box, UserCheck, MapPin, FileText } from 'lucide-react';

export default function USPs() {
  const usps = [
    {
      title: "Doorstep Service",
      desc: "We come to you. Don't waste time traveling to a repair shop.",
      icon: <Truck size={28} />,
    },
    {
      title: "Same-Day Repair",
      desc: "Get your phone fixed in 30–60 minutes, right in front of you.",
      icon: <Clock size={28} />,
    },
    {
      title: "Warranty Included",
      desc: "6-month warranty on batteries. Screen warranty only when warranty combo is selected.",
      icon: <ShieldCheck size={28} />,
    },
    {
      title: "Data Privacy",
      desc: "Repairs happen right in front of you — your data stays safe.",
      icon: <Lock size={28} />,
    },
    {
      title: "WhatsApp Support",
      desc: "Quick query responses on WhatsApp before and after repair.",
      icon: <MessageCircle size={28} />,
    },
    {
      title: "Digital Invoice",
      desc: "Professional invoice sent digitally after every repair.",
      icon: <Receipt size={28} />,
    },
  ];

  const offers = [
    {
      title: "Student Discount",
      desc: "Show your college ID to get a special discount on repair.",
      icon: <Percent size={24} className="text-emerald-500" />,
    },
    {
      title: "Family Offer",
      desc: "Repair 2 or more phones and get a significant discount.",
      icon: <Users size={24} className="text-blue-500" />,
    },
    {
      title: "Free Pickup & Drop",
      desc: "For major repairs — coming soon to more areas.",
      icon: <Box size={24} className="text-amber-500" />,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Why Choose Us?</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Premium service with transparent pricing. Our trained technicians visit your home.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {usps.map((usp, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {usp.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{usp.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{usp.desc}</p>
            </div>
          ))}
        </div>

        {/* Premium Features Banner */}
        <div className="bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white mb-16">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <UserCheck size={200} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-widest mb-6">Premium Features</span>
              <h3 className="text-3xl font-black mb-4">Trained Technician Visit</h3>
              <p className="text-slate-400 mb-8 max-w-xl leading-relaxed">Our background-verified expert technicians visit your home. See transparent pricing online before booking — no surprises.</p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-emerald-400"><MapPin size={18} /> Live Tracking (Coming Soon)</div>
                <div className="flex items-center gap-2 text-blue-400"><FileText size={18} /> Transparent Pricing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Offers */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Special Offers</h3>
          <p className="text-slate-500 text-sm">Save more on multiple repairs and student IDs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0">
                {offer.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{offer.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
