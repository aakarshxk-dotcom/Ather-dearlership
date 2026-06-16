'use client';

import { motion, useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate(value: number) {
        if (decimals > 0) {
          setDisplayValue(value.toFixed(decimals));
        } else {
          setDisplayValue(Math.floor(value).toLocaleString('en-IN'));
        }
      },
    });

    return () => controls.stop();
  }, [isInView, target, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 5000,
    suffix: '+',
    label: 'Happy Riders',
    colorClass: 'neon-text-green',
    icon: '🏍️',
  },
  {
    value: 2,
    suffix: '',
    label: 'Showrooms in Patna',
    colorClass: 'neon-text-cyan',
    icon: '🏪',
  },
  {
    value: 5,
    suffix: '+',
    label: 'Years of Trust',
    colorClass: 'text-neon-gold',
    icon: '🏆',
  },
  {
    value: 4.8,
    suffix: '★',
    label: 'Customer Rating',
    colorClass: 'gradient-text-green',
    icon: '⭐',
    decimals: 1,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-16 md:py-20 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,255,136,0.04), transparent), radial-gradient(ellipse 80% 60% at 80% 30%, rgba(0,200,255,0.03), transparent), radial-gradient(ellipse 60% 80% at 50% 80%, rgba(0,255,136,0.03), transparent)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="glass-card-static p-5 md:p-6 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div
                className={`text-3xl md:text-4xl font-black ${stat.colorClass}`}
              >
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
