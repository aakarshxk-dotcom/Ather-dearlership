'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/app';

const slides = [
  { image: '/hero-showroom-1.jpg', alt: 'Modern EV Showroom' },
  { image: '/hero-scooter-2.jpg', alt: 'Premium Scooter Display' },
  { image: '/hero-interior-3.jpg', alt: 'Luxury Dealership Interior' },
  { image: '/hero-meeting-4.jpg', alt: 'Investor Meeting' },
  { image: '/hero-customer-5.jpg', alt: 'Customer Experience' },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeUpDelay = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 },
  },
};

export function HeroSection() {
  const { setViewMode } = useAppStore();
  const [current, setCurrent] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setNextSlide((current + 1) % slides.length);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setNextSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 1000);
  }, [current, isTransitioning]);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goToNext]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setNextSlide((current - 1 + slides.length) % slides.length);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      setNextSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 1000);
  }, [current, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setNextSlide(index);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 1000);
  }, [current, isTransitioning]);

  return (
    <section id="home" className="relative w-full h-[90vh] md:h-[90vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === current ? 1 : index === nextSlide && isTransitioning ? 0 : 0,
            zIndex: index === current ? 1 : 0,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === current ? 'scale(1.05)' : 'scale(1.1)',
            }}
          />
        </div>
      ))}

      {isTransitioning && (
        <div
          className="absolute inset-0 z-[2] transition-opacity duration-1000 ease-in-out"
          style={{ opacity: 1 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[nextSlide].image})`,
              transform: 'scale(1.05)',
            }}
          />
        </div>
      )}

      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 h-32 z-[3] bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-white/90 text-xs font-semibold uppercase tracking-[0.2em] mb-6 border border-white/10">
                India&apos;s #1 EV Dealership Opportunity
              </span>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-gray-400 uppercase tracking-[0.3em] font-medium mb-2">
              START YOUR
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] text-white"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.3)' }}
            >
              Ather Energy
              <br />
              Dealership Journey
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-white/80 max-w-xl mt-6 leading-relaxed"
            >
              Partner with India&apos;s leading electric mobility brand and build a profitable future-ready business.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 mt-10"
            >
              <button
                onClick={() => setViewMode('apply')}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#059669] to-[#047857] text-white font-semibold rounded-full px-10 py-4 text-base shadow-[0_8px_30px_rgba(5,150,105,0.35)] hover:shadow-[0_12px_40px_rgba(5,150,105,0.45)] hover:from-[#047857] hover:to-[#065f46] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                Apply For Dealership
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#why-ather"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('why-ather')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full px-8 py-4 font-semibold hover:bg-white/20 transition-all duration-300 text-sm cursor-pointer"
              >
                Explore Opportunity
                <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-4 z-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/25 transition-all flex items-center justify-center text-white/80 hover:text-white cursor-pointer border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 z-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/25 transition-all flex items-center justify-center text-white/80 hover:text-white cursor-pointer border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === current
                ? 'bg-white w-8'
                : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
