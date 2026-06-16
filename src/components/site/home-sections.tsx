'use client';

import { motion, useInView, animate, AnimatePresence, type Variants } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Shield,
  Award,
  ArrowRight,
  CheckCircle2,
  Building2,
  Target,
  BarChart3,
  GraduationCap,
  Package,
  Megaphone,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Quote,
  Star,
  IndianRupee,
  X,
} from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function safeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === 'bigint') return data.toString();
  if (Array.isArray(data)) return data.map(safeData);
  if (typeof data === 'object') {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      obj[key] = safeData(value);
    }
    return obj;
  }
  return data;
}

function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent =
            prefix + Math.floor(value).toLocaleString('en-IN') + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [isInView, target, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const stats = [
    { icon: <IndianRupee className="w-5 h-5 text-emerald-600" />, value: 25, prefix: '₹', suffix: 'L+', label: 'Investment Starting From' },
    { icon: <MapPin className="w-5 h-5 text-emerald-600" />, value: 100, prefix: '', suffix: '+', label: 'Cities Covered' },
    { icon: <Building2 className="w-5 h-5 text-emerald-600" />, value: 500, prefix: '', suffix: '+', label: 'Showrooms Opened' },
    { icon: <Star className="w-5 h-5 text-emerald-600" />, value: 98, prefix: '', suffix: '%', label: 'Partner Satisfaction' },
  ];

  return (
    <section id="about" className="-mt-20 relative z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 md:p-12"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="rounded-full bg-emerald-50 p-3 w-fit mx-auto">
                  {stat.icon}
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-3">
                  {stat.label}
                </p>
                <div className="text-3xl md:text-4xl font-black text-slate-900 mt-1">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function WhyPartnerSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      title: 'High ROI',
      description:
        'Average returns of 15-20% annually with multiple revenue streams including vehicle sales, accessories, service, and insurance.',
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      title: 'EV Market Leader',
      description:
        'Ather is India\'s leading electric scooter brand with 40%+ YoY growth in the EV two-wheeler segment.',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: 'End-to-End Support',
      description:
        'From showroom setup to staff training, marketing to inventory — complete business support.',
    },
    {
      icon: <Megaphone className="w-6 h-6 text-emerald-600" />,
      title: 'Marketing Support',
      description:
        'National and regional campaigns, digital marketing, co-branded materials, and launch events.',
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
      title: 'Training Programs',
      description:
        'Comprehensive 4-week training covering sales, service, operations, and customer management.',
    },
    {
      icon: <Package className="w-6 h-6 text-emerald-600" />,
      title: 'Service Support',
      description:
        'Dedicated service infrastructure, spare parts supply chain, and technical support system.',
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">
            Why Partner With Ather Energy?
          </h2>
          <p className="text-gray-500 text-center mt-4 text-lg">
            Join India&apos;s fastest-growing EV revolution.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp} className="luxury-card p-7">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function TrustSection() {
  const logos = ['Forbes', 'Business Standard', 'ET Auto', 'Moneycontrol', 'Inc42', 'YourStory'];

  return (
    <section className="bg-[#FAFAFA] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-widest text-gray-400 text-center font-semibold">
          Featured In
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 mt-10">
          {logos.map((name) => (
            <span
              key={name}
              className="text-xl md:text-2xl font-bold text-gray-300 tracking-tight hover:text-gray-400 transition cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const steps = [
    { num: 1, title: 'Apply', desc: 'Submit your application online' },
    { num: 2, title: 'Verification', desc: 'Profile & background verification' },
    { num: 3, title: 'Review', desc: 'Investment capacity assessment' },
    { num: 4, title: 'Approval', desc: 'Location inspection & approval' },
    { num: 5, title: 'Agreement', desc: 'Franchise agreement signing' },
    { num: 6, title: 'Setup', desc: 'Showroom setup & training (4-6 weeks)' },
    { num: 7, title: 'Launch', desc: 'Grand opening & business launch' },
  ];

  return (
    <section id="process" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Dealership Process
          </h2>
          <p className="text-gray-500 text-center mt-4">
            From application to launch in 7 simple steps.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="hidden md:block mt-14"
        >
          <div className="relative">
            <div className="absolute top-7 left-[calc(100%/14)] right-[calc(100%/14)] h-0.5 bg-gray-200" />

            <div className="grid grid-cols-7 gap-2">
              {steps.map((step) => (
                <motion.div key={step.num} variants={fadeUp} className="relative flex flex-col items-center text-center px-1">
                  <div className="w-14 h-14 rounded-full bg-[#059669] text-white font-bold text-lg flex items-center justify-center z-10 shadow-lg shadow-emerald-600/20">
                    {step.num}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-4">{step.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[120px]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="md:hidden mt-14"
        >
          <div className="relative pl-8">
            <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-gray-200" />

            <div className="space-y-8">
              {steps.map((step) => (
                <motion.div key={step.num} variants={fadeUp} className="relative flex items-start gap-4">
                  <div className="absolute -left-8 top-0 w-11 h-11 rounded-full bg-[#059669] text-white font-bold text-sm flex items-center justify-center z-10 shadow-lg shadow-emerald-600/20 shrink-0">
                    {step.num}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function InvestmentSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const cards = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Investment Range',
      amount: '₹25 - 50 Lakhs',
      description: 'Includes showroom setup, inventory, deposits & working capital',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Revenue Potential',
      amount: '₹15-25L/Month',
      description: 'Average monthly revenue for established metro showrooms',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Profit Margin',
      amount: '12-18% Gross',
      description: 'On vehicle sales plus 25-30% on accessories & service',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Break Even',
      amount: '12-18 Months',
      description: 'Most partners achieve profitability within the first year',
    },
  ];

  return (
    <section id="investment" className="bg-[#FAFAFA] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Investment &amp; Returns
          </h2>
          <p className="text-gray-500 text-center mt-4">
            Transparent pricing with a clear path to profitability
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
              <p className="text-2xl font-black text-[#059669] mt-2">{card.amount}</p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

const galleryCategories = ['All', 'Showroom', 'Interior', 'Exterior', 'Launch Events'];

const fallbackGallery: GalleryImage[] = [
  { id: 1, title: 'Ather Experience Center — Mumbai', category: 'Showroom', imageUrl: '/placeholder-gallery-1.jpg' },
  { id: 2, title: 'Premium Interior Design', category: 'Interior', imageUrl: '/placeholder-gallery-2.jpg' },
  { id: 3, title: 'Ather 450X Display Area', category: 'Exterior', imageUrl: '/placeholder-gallery-3.jpg' },
  { id: 4, title: 'Grand Opening — Bangalore', category: 'Launch Events', imageUrl: '/placeholder-gallery-4.jpg' },
  { id: 5, title: 'Service Bay Setup', category: 'Interior', imageUrl: '/placeholder-gallery-5.jpg' },
  { id: 6, title: 'Ather Space — Delhi NCR', category: 'Showroom', imageUrl: '/placeholder-gallery-6.jpg' },
];

export function GalleryPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [images, setImages] = useState<GalleryImage[]>(fallbackGallery);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          const cleaned = safeData(data) as GalleryImage[];
          if (Array.isArray(cleaned) && cleaned.length > 0) {
            setImages(cleaned);
            return;
          }
        }
      } catch {
      }
    }
    fetchGallery();
  }, []);

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  return (
    <section id="gallery" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Our Showrooms
          </h2>
          <p className="text-gray-500 text-center mt-4">
            Experience the Ather Energy dealership standard.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-[#059669] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="masonry-grid mt-10"
        >
          {filtered.map((img) => (
            <motion.div
              key={img.id}
              variants={fadeUp}
              className="luxury-card overflow-hidden group cursor-pointer"
              onClick={() => setLightboxImage(img)}
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className="object-cover w-full h-auto group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain bg-gray-50"
                />
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-900">{lightboxImage.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{lightboxImage.category}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface Testimonial {
  name: string;
  title: string;
  content: string;
  rating: number;
}

const fallbackTestimonials: Testimonial[] = [
  {
    name: 'Rajesh Kumar',
    title: 'Ather Dealership Partner, Mumbai',
    content:
      'Investing in Ather Energy Dealership was the best decision I made. The support system is incredible — from initial setup to ongoing marketing, everything is handled professionally. My showroom turned profitable within 14 months.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    title: 'Ather Multi-Location Owner, Bangalore',
    content:
      'What sets Ather Energy Dealership apart is the complete ecosystem support. The training programs prepared my staff exceptionally well, and the smart inventory system has virtually eliminated dead stock issues.',
    rating: 5,
  },
  {
    name: 'Amit Patel',
    title: 'Ather Dealership Partner, Ahmedabad',
    content:
      'The transparency in operations and financial reporting gives me complete confidence. Revenue streams from accessories and service alone cover my operating costs. Highly recommend Ather Energy Dealership to any aspiring entrepreneur.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          const cleaned = safeData(data) as Testimonial[];
          if (Array.isArray(cleaned) && cleaned.length > 0) {
            setTestimonials(cleaned);
            setLoading(false);
            return;
          }
        }
      } catch {
      }
      setTestimonials(fallbackTestimonials);
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2);

  if (loading) {
    return (
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 w-72 bg-gray-200 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-pulse">
                <div className="w-10 h-10 bg-emerald-100 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-5/6 bg-gray-100 rounded" />
                  <div className="h-3 w-4/6 bg-gray-100 rounded" />
                </div>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="space-y-1">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-2 w-32 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            What Our Partners Say
          </h2>
        </motion.div>

        <motion.div
          ref={containerRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mt-14"
        >
          {testimonials.map((t, idx) => (
            <motion.div key={idx} variants={fadeUp} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <Quote className="w-10 h-10 text-emerald-100 mb-4" />
              <p className="italic text-gray-600 text-sm leading-relaxed">{t.content}</p>
              <div className="flex gap-0.5 mt-4 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'star-filled' : 'star-empty'}`}
                    fill={i < t.rating ? '#F59E0B' : 'none'}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="md:hidden mt-14">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
              >
                <Quote className="w-10 h-10 text-emerald-100 mb-4" />
                <p className="italic text-gray-600 text-sm leading-relaxed">
                  {testimonials[currentIndex]?.content}
                </p>
                <div className="flex gap-0.5 mt-4 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (testimonials[currentIndex]?.rating ?? 0) ? 'star-filled' : 'star-empty'}`}
                      fill={i < (testimonials[currentIndex]?.rating ?? 0) ? '#F59E0B' : 'none'}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                    {getInitials(testimonials[currentIndex]?.name ?? '??')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{testimonials[currentIndex]?.name}</p>
                    <p className="text-xs text-gray-400">{testimonials[currentIndex]?.title}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === currentIndex ? 'bg-[#059669]' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FAQ {
  question: string;
  answer: string;
}

const fallbackFAQs: FAQ[] = [
  {
    question: 'What is the minimum investment required to open an Ather Energy Dealership showroom?',
    answer:
      'The minimum investment ranges from ₹25 to ₹50 Lakhs depending on the city tier and showroom size. This includes showroom setup, initial inventory, security deposits, and 3 months of working capital. We offer flexible payment plans to help you get started.',
  },
  {
    question: 'How long does it take to set up and launch an Ather Energy showroom?',
    answer:
      'From agreement signing to grand opening typically takes 8-12 weeks. This includes location evaluation, branded interior design, equipment installation, staff recruitment, and training. Our dedicated setup team guides you through every step.',
  },
  {
    question: 'Do I need prior experience in the automobile industry?',
    answer:
      'While prior experience in automobiles or retail is beneficial, it is not mandatory. We provide comprehensive 4-week training programs covering all aspects of the business — from sales and service to operations and customer management. Many of our most successful partners came from non-automotive backgrounds.',
  },
  {
    question: 'What kind of ongoing support do Ather Energy dealership partners receive?',
    answer:
      'We provide end-to-end support including national and regional marketing campaigns, digital marketing assistance, staff training and development programs, smart inventory management systems, business analytics dashboards, and a dedicated relationship manager for your showroom.',
  },
];

export function FAQSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          const cleaned = safeData(data) as FAQ[];
          if (Array.isArray(cleaned) && cleaned.length > 0) {
            setFaqs(cleaned);
            setLoading(false);
            return;
          }
        }
      } catch {
      }
      setFaqs(fallbackFAQs);
      setLoading(false);
    }
    fetchFAQs();
  }, []);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="bg-[#FAFAFA] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {loading ? (
          <div className="max-w-3xl mx-auto space-y-3 mt-14">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 w-3/4 rounded bg-gray-200 mb-2" />
                <div className="h-3 w-full rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            ref={containerRef}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="max-w-3xl mx-auto mt-14 space-y-3"
          >
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div key={idx} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex justify-between items-center p-6 text-left font-semibold text-slate-900 hover:text-[#059669] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 text-sm leading-relaxed px-6 pb-6">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch {
    }
    setSubmitting(false);
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5 text-emerald-600" />, label: 'Email', value: 'admin@atherdealership.in', href: 'mailto:admin@atherdealership.in' },
    { icon: <MapPin className="w-5 h-5 text-emerald-600" />, label: 'Address', value: '123 Business Hub, MG Road, New Delhi - 110001' },
    { icon: <Clock className="w-5 h-5 text-emerald-600" />, label: 'Business Hours', value: 'Mon - Sat: 9:00 AM - 7:00 PM' },
  ];

  return (
    <section id="contact" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 gradient-text">
            Get In Touch
          </h2>
          <p className="text-gray-500 text-center mt-4">
            Take the first step towards your Ather Energy Dealership
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mt-14"
        >
          <motion.div variants={fadeUp} className="space-y-5">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            {success ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="btn-luxury-primary mt-6 inline-block text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-luxury space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full bg-white border ${errors.name ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full bg-white border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className={`w-full bg-white border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Ather Energy Dealership inquiry"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your interest..."
                    className={`w-full bg-white border ${errors.message ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition resize-none`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-luxury-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
