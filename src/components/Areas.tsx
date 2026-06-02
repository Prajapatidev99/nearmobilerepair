import { MapPin } from "lucide-react";

const areas = [
  "Navrangpura", "Vastrapur", "Satellite", "Bopal", "SG Highway",
  "Bodakdev", "Prahlad Nagar", "Thaltej", "Chandkheda", "Ghatlodia",
  "Naranpura", "Maninagar", "Nikol", "CG Road", "Ambawadi",
  "Paldi", "Iscon", "Drive-in Road", "Memnagar", "New Ranip",
];

export default function Areas() {
  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-white" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-widest mb-4">
            <MapPin size={14} /> Service Coverage
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            We Cover All of Ahmedabad
          </h2>
          <p className="text-slate-400 text-lg">
            Doorstep repair available across 20+ areas. Same-day service in most locations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {areas.map((area) => (
            <span
              key={area}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-sm font-medium text-slate-300 hover:border-blue-500 hover:text-blue-300 hover:bg-slate-700 transition-all cursor-default"
            >
              <MapPin size={12} className="text-blue-400 shrink-0" />
              {area}
            </span>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-sm mb-4">Don't see your area? We're expanding!</p>
          <a
            href={`https://wa.me/919974221322?text=${encodeURIComponent("Hi, I'd like to check if you provide doorstep repair service in my area.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/30"
          >
            <img src="https://cdn.simpleicons.org/whatsapp/ffffff" width="18" height="18" alt="WhatsApp" />
            Check Your Area on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
