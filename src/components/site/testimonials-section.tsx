'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  { name: 'Rajesh Kumar', title: 'Business Owner', rating: 5, text: 'The Ather 450X is a game-changer! I save ₹3,000 every month on fuel. The pickup is incredible and the ride quality is leagues ahead of any petrol scooter I\'ve owned.', initials: 'RK' },
  { name: 'Priya Singh', title: 'IT Professional', rating: 5, text: 'Booked a test ride online and the experience was seamless. The team at the Patna showroom was very helpful. Got my Rizta delivered within a week!', initials: 'PS' },
  { name: 'Amit Sharma', title: 'College Student', rating: 5, text: 'Best decision I made! The 450S fits my budget perfectly and the smart features like Google Maps and ride stats are super useful for daily college commute.', initials: 'AS' },
  { name: 'Dr. Meena Devi', title: 'Doctor', rating: 4, text: 'I bought the Rizta for my daily hospital rounds. Comfortable ride, great storage, and the zero emissions make me feel good about my choice. Highly recommended!', initials: 'MD' },
  { name: 'Vikram Patel', title: 'Software Engineer', rating: 5, text: 'The performance of the 450X Gen 3 is insane. Warp mode is addictive! The connected features and OTA updates keep making the scooter better over time.', initials: 'VP' },
  { name: 'Sneha Verma', title: 'Teacher', rating: 5, text: 'Switched from a petrol Activa to Ather 450S. No regrets! The silent ride, low maintenance, and the Patna service center is just 2km from my home.', initials: 'SV' },
  { name: 'Rahul Jha', title: 'Delivery Partner', rating: 4, text: 'Using the 450X for food delivery. 150km range means I can do a full day on one charge. The fast charging at Ather Grid stations is very convenient.', initials: 'RJ' },
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

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="gradient-text-green text-3xl md:text-5xl font-[family-name:var(--font-heading)]">
            What Our Riders Say
          </h2>
          <p className="text-muted-foreground mt-4 text-center">
            Real experiences from Ather owners in Patna
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/20 flex items-center justify-center text-sm font-bold text-neon-green">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.title}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < testimonial.rating
                        ? 'star-filled w-3.5 h-3.5'
                        : 'star-empty w-3.5 h-3.5'
                    }
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Quote className="text-neon-green/20 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-premium-silver/70 text-sm leading-relaxed">
                  {testimonial.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
