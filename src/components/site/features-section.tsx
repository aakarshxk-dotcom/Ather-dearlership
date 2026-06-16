'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Battery, Globe, Shield, Leaf, Wrench } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Performance',
    description:
      '0-40 km/h in 3.3 seconds. The most powerful electric scooter in its class with Warp Mode for instant acceleration.',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
  },
  {
    icon: Battery,
    title: 'Battery Technology',
    description:
      'Proprietary 3.7 kWh lithium-ion battery pack with 150km range. Fast charging to 80% in under 3 hours.',
    gradient: 'bg-gradient-to-br from-cyan-500 to-teal-600',
  },
  {
    icon: Globe,
    title: 'Connected Experience',
    description:
      '7-inch touchscreen with Google Maps, 4G connectivity, over-the-air updates, and ride statistics.',
    gradient: 'bg-gradient-to-br from-amber-400 to-yellow-600',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description:
      'Hydraulic disc brakes, regenerative braking, all-metal body, IP67 rated battery, and reverse assist.',
    gradient: 'bg-gradient-to-br from-purple-500 to-[#A855F7]',
  },
  {
    icon: Leaf,
    title: 'Zero Emissions',
    description:
      '100% electric with zero tailpipe emissions. Save \u20B950,000/year on fuel costs compared to petrol scooters.',
    gradient: 'bg-gradient-to-br from-green-400 to-emerald-500',
  },
  {
    icon: Wrench,
    title: 'Service Network',
    description:
      '150+ service centers across 45+ cities. Doorstep service available with Ather Mobile Service.',
    gradient: 'bg-gradient-to-br from-cyan-400 to-teal-500',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

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
}

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="gradient-text-green text-3xl md:text-5xl font-black">
            Why Choose Ather?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Technology that redefines urban mobility
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-16"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="glass-card p-6 md:p-8"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mt-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
