'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    label: 'Showroom Address',
    value: 'Near Boring Road Crossing, Boring Road, Patna - 800001, Bihar',
    subValue: 'Branch: Fraser Road, Patna - 800001',
  },
  {
    icon: Phone,
    label: 'Phone Numbers',
    value: '+91 98765 43210',
    subValue: '+91 87654 32109',
    links: ['tel:+919876543210', 'tel:+918765432109'],
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@atherpatna.com',
    links: ['mailto:info@atherpatna.com'],
  },
  {
    icon: Clock,
    label: 'Operating Hours',
    value: 'Mon - Sat: 9:00 AM - 7:00 PM',
    subValue: 'Sunday: 10:00 AM - 4:00 PM',
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

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="gradient-text-green text-3xl md:text-5xl font-[family-name:var(--font-heading)]">
            Visit Our Showroom
          </h2>
          <p className="text-muted-foreground mt-4 text-center">
            Experience Ather electric scooters in person
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Left Column — Contact Info */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="space-y-5"
          >
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={info.label}
                  variants={cardVariants}
                  className="glass-card-static p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex-shrink-0 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-neon-green" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
                        {info.label}
                      </p>
                      {'links' in info && info.links ? (
                        <>
                          <a
                            href={info.links[0]}
                            className="hover:text-neon-green transition text-white text-sm font-medium mt-0.5 block"
                          >
                            {info.value}
                          </a>
                          {info.subValue && (
                            <a
                              href={info.links[1]}
                              className="hover:text-neon-green transition text-muted-foreground text-sm mt-0.5 block"
                            >
                              {info.subValue}
                            </a>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-white text-sm font-medium mt-0.5">
                            {info.value}
                          </p>
                          {info.subValue && (
                            <p className="text-muted-foreground text-sm mt-0.5">
                              {info.subValue}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Right Column — Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="map-embed"
          >
            <iframe
              width="100%"
              height="100%"
              style={{ minHeight: '400px' }}
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.7559905809454!2d85.0130!3d25.6117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58dce6732867%3A0x4059f39a1ac82f06!2sBoring%20Road%2C%20Patna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              title="Ather Energy Patna Showroom Location"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
