'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Target, Clock, Users } from 'lucide-react';

const stats = [
  { label: 'CV créés', value: 2500, suffix: '+', icon: FileText, color: 'text-blue-400' },
  { label: 'Compatibilité ATS', value: 98, suffix: '%', icon: Target, color: 'text-green-400' },
  { label: 'Temps moyen', value: 2, suffix: ' min', icon: Clock, color: 'text-amber-400' },
  { label: 'Utilisateurs actifs', value: 500, suffix: '+', icon: Users, color: 'text-purple-400' },
];

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const increment = end / (duration * 60); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString('fr-FR')}{suffix}
    </span>
  );
}

export function StatsCounter() {
  return (
    <section className="bg-bg-dark border-y border-white/5 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-3 opacity-60`} />
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
