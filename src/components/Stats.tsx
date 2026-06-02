import { useEffect, useRef, useState } from "react";

interface StatItem {
  end: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { end: 1200, suffix: "+", label: "Repairs Done" },
  { end: 4.9, suffix: "★", label: "Average Rating", prefix: "" },
  { end: 30, suffix: " min", label: "Avg. Repair Time" },
  { end: 100, suffix: "%", label: "Satisfaction Rate" },
];

function Counter({ end, suffix, prefix = "" }: { end: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const isDecimal = end % 1 !== 0;
          const duration = 1800;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {prefix}{end % 1 !== 0 ? count.toFixed(1) : count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                <Counter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <p className="text-blue-100 font-medium text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
