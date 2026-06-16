'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Gauge, Battery, Clock, ArrowRight, Star } from 'lucide-react';

const models = [
  {
    name: 'Ather 450X Gen 3',
    badge: 'FLAGSHIP',
    price: 189999,
    tagline: 'The Ultimate Performance Scooter',
    range: '150 km',
    topSpeed: '90 km/h',
    chargingTime: '3.3 hrs',
    battery: '3.7 kWh',
    color: '#00FF88',
    rating: 4.8,
    reviews: 1240,
  },
  {
    name: 'Ather 450S',
    badge: 'POPULAR',
    price: 139999,
    tagline: 'Smart Performance, Accessible Price',
    range: '115 km',
    topSpeed: '80 km/h',
    chargingTime: '4.5 hrs',
    battery: '3.0 kWh',
    color: '#00E5FF',
    rating: 4.7,
    reviews: 980,
  },
  {
    name: 'Ather Rizta',
    badge: 'NEW',
    price: 109999,
    tagline: 'Designed for the Family',
    range: '125 km',
    topSpeed: '70 km/h',
    chargingTime: '5.2 hrs',
    battery: '2.9 kWh',
    color: '#FFD700',
    rating: 4.6,
    reviews: 650,
  },
];

function formatPrice(price: number): string {
  return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(price);
}

function formatReviews(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return String(count);
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function ModelsShowcase() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const specs = [
    { icon: Gauge, label: 'Top Speed', key: 'topSpeed' as const },
    { icon: Battery, label: 'Range', key: 'range' as const },
    { icon: Clock, label: 'Charge Time', key: 'chargingTime' as const },
    { icon: Zap, label: 'Battery', key: 'battery' as const },
  ];

  return (
    <section id="models" ref={ref} className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-heading)] gradient-text-green">
            Explore Our Models
          </h2>
          <p className="text-muted-foreground mt-4">
            Find your perfect electric ride
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {models.map((model) => (
            <motion.div
              key={model.name}
              className="glass-card model-card-glow p-6 flex flex-col"
              variants={fadeUp}
            >
              {/* Badge & Rating */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[10px] uppercase tracking-widest font-bold border rounded-full px-3 py-1"
                  style={{
                    borderColor: model.color + '30',
                    color: model.color,
                  }}
                >
                  {model.badge}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-white text-xs font-medium">
                    {model.rating}
                  </span>
                  <span className="text-xs">
                    ({formatReviews(model.reviews)} reviews)
                  </span>
                </div>
              </div>

              {/* Name & Tagline */}
              <h3
                className="text-xl md:text-2xl font-bold text-white font-[family-name:var(--font-heading)]"
              >
                {model.name}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {model.tagline}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl font-bold neon-text-green">
                  {formatPrice(model.price)}
                </span>
                <span className="text-muted-foreground text-sm">onwards</span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5 my-5" />

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 flex-1">
                {specs.map((spec) => {
                  const Icon = spec.icon;
                  return (
                    <div
                      key={spec.key}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-xs" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[11px]">
                          {spec.label}
                        </p>
                        <p className="text-white text-sm font-semibold">
                          {model[spec.key]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <button className="btn-glass text-sm w-full flex items-center justify-center gap-2 mt-6">
                Know More
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}