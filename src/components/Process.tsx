import { CalendarCheck, UserCheck, MapPin, CheckCircle2 } from "lucide-react";

export default function Process() {
  const steps = [
    {
      num: "01",
      icon: <CalendarCheck size={28} className="text-blue-400" />,
      title: "Book Online",
      desc: "Select your device, describe the issue, and pick a time slot.",
    },
    {
      num: "02",
      icon: <UserCheck size={28} className="text-blue-400" />,
      title: "Technician Assigned",
      desc: "We confirm your booking and assign a verified technician.",
    },
    {
      num: "03",
      icon: <MapPin size={28} className="text-blue-400" />,
      title: "Doorstep Visit",
      desc: "Technician arrives at your home at the scheduled time.",
    },
    {
      num: "04",
      icon: <CheckCircle2 size={28} className="text-emerald-400" />,
      title: "Repair & Pay",
      desc: "Repair done in 30–60 min. Pay only after full satisfaction.",
    },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">How It Works</h2>
          <p className="text-slate-400 text-lg">A simple, transparent 4-step process to get your phone fixed at home.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              {/* Step box */}
              <div className="w-20 h-20 rounded-[20px] bg-slate-800 flex flex-col items-center justify-center mb-5 border border-slate-700 shadow-lg shadow-black/30">
                {step.icon}
                <span className="text-xs font-black text-slate-500 mt-1">{step.num}</span>
              </div>
              <h4 className="text-lg font-bold mb-2">{step.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[180px]">{step.desc}</p>

              {/* Connector arrow — visible on md+ between steps */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-10 items-center" style={{ left: "calc(50% + 40px)", width: "calc(100% - 80px)" }}>
                  <div className="flex-1 h-px bg-slate-700" />
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
