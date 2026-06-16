'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, BadgeCheck, Wrench, Truck, HandCoins, Headphones } from 'lucide-react'

const benefits = [
  { icon: Shield, title: 'Authorized Dealer', description: 'Official Ather Energy dealership with genuine products, warranty, and certified technicians.' },
  { icon: BadgeCheck, title: 'Best Price Guarantee', description: 'Competitive pricing with no hidden charges. We match any authorized dealer\'s price in Bihar.' },
  { icon: Wrench, title: 'Expert Service Center', description: 'Dedicated service center with trained technicians, genuine spare parts, and quick turnaround time.' },
  { icon: Truck, title: 'Home Delivery Available', description: 'Get your Ather delivered right to your doorstep in Patna. Free delivery within city limits.' },
  { icon: HandCoins, title: 'Easy Financing', description: 'Multiple EMI options from leading banks. Get approved in 5 minutes with minimal documentation.' },
  { icon: Headphones, title: '24/7 Roadside Support', description: 'Comprehensive roadside assistance across Bihar. One call and we\'re there to help you.' },
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

export function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 md:py-28 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0,200,255,0.03), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <h2 className="gradient-text-green text-3xl md:text-5xl font-[family-name:var(--font-heading)]">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground mt-4 text-center">
            Patna&apos;s most trusted Ather Energy dealership
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                variants={cardVariants}
                className="glass-card p-6 md:p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/10 to-neon-cyan/10 border border-neon-green/10 flex items-center justify-center">
                  <Icon className="text-neon-green w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-lg mt-4 font-[family-name:var(--font-heading)]">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
