'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Zap,
  TrendingUp,
  GraduationCap,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Send,
  ArrowRight,
} from 'lucide-react'

const benefits = [
  { icon: Zap, label: 'Zero Royalty Fees' },
  { icon: TrendingUp, label: 'Marketing Support' },
  { icon: GraduationCap, label: 'Training Programs' },
]

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
}

export function DealershipCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="dealership"
      className="w-full py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background: subtle radial gradient from neon-green */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,136,0.05), transparent)',
        }}
      />

      <motion.div
        ref={ref}
        variants={fadeUpVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
      >
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="glass-card-static inline-flex items-center px-4 py-1.5 rounded-full border border-neon-green/30 text-neon-green text-xs uppercase tracking-widest font-medium">
            DEALERSHIP OPPORTUNITY
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white font-[family-name:var(--font-heading)]">
          Build Your Future with Ather
        </h2>

        {/* Description */}
        <p className="text-premium-silver/70 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          Join India&apos;s fastest-growing EV ecosystem. Get access to premium
          infrastructure, cutting-edge technology, and a proven business model.
        </p>

        {/* Benefit chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <span
                key={benefit.label}
                className="glass-card-static inline-flex items-center gap-2 px-4 py-2 rounded-full"
              >
                <Icon className="w-4 h-4 text-neon-green" />
                <span className="text-sm text-white/80">{benefit.label}</span>
              </span>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <button className="btn-neon-green text-base md:text-lg px-8 py-4 font-bold rounded-xl">
            Apply for Dealership
          </button>
        </div>

        {/* Secondary link */}
        <p className="mt-4">
          <span className="text-neon-cyan hover:underline cursor-pointer">
            or Book a Consultation &rarr;
          </span>
        </p>
      </motion.div>
    </section>
  )
}

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Models', href: '#models' },
  { label: 'Features', href: '#features' },
  { label: 'Book Test Ride', href: '#test-ride' },
  { label: 'EMI Calculator', href: '#emi-calculator' },
  { label: 'Contact Us', href: '#contact' },
]

const supportLinks = [
  'Service Center',
  'Warranty',
  'Insurance',
  'Roadside Assist',
  'FAQ',
  'Spare Parts',
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Linkedin, label: 'LinkedIn' },
]

export function HomepageFooter() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email && email.includes('@') && email.includes('.')) {
      setSubscribed(true)
      setTimeout(() => {
        setEmail('')
        setSubscribed(false)
      }, 2000)
    }
  }

  return (
    <footer id="about" className="glass-panel border-t border-white/5">
      <motion.div
        ref={ref}
        variants={fadeUpVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto px-4 py-12 md:py-16"
      >
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <span className="text-sm font-black text-white">AE</span>
            </div>
            <p className="text-white font-bold text-lg mt-3">ATHER ENERGY</p>
            <p className="text-muted-foreground text-sm mt-1">
              Authorized Dealer — Patna, Bihar
            </p>
            <p className="text-muted-foreground/70 text-xs mt-2">
              India&apos;s Smartest Electric Scooters
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-neon-green transition text-sm cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      const id = link.href.replace('#', '')
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              SUPPORT
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-neon-green transition text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              STAY UPDATED
            </h4>
            <p className="text-muted-foreground text-sm mb-3">
              Get latest offers, news, and updates about Ather electric scooters.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="newsletter-input flex-1"
              />
              <button
                onClick={handleSubscribe}
                className="w-10 h-10 rounded-lg bg-neon-green flex items-center justify-center flex-shrink-0"
              >
                <Send className="w-4 h-4 text-midnight" />
              </button>
            </div>
            {subscribed && (
              <p className="text-neon-green text-xs mt-2">Subscribed successfully!</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; 2024 Ather Energy Dealers, Patna. All rights reserved.
          </p>
          <p className="text-muted-foreground/50 text-xs">
            An authorized dealership of Ather Energy Limited
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full glass-card-static flex items-center justify-center hover:border-neon-green/40 transition"
                >
                  <Icon className="w-4 h-4 text-muted-foreground hover:text-neon-green transition" />
                </a>
              )
            })}
          </div>
        </div>
      </motion.div>
    </footer>
  )
}