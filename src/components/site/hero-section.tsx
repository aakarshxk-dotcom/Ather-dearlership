'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Pause, Play } from 'lucide-react';
import { useAppStore } from '@/store/app';

interface Slide {
  image: string;
  fallback: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

const slides: Slide[] = [
  {
    image: '/images/hero/slide1.jpg',
    fallback: '/images/hero/slide1.svg',
    alt: 'Modern Ather EV Showroom',
  },
  {
    image: '/images/hero/slide2.jpg',
    fallback: '/images/hero/slide2.svg',
    alt: 'Ather 450X Premium Scooter',
  },
  {
    image: '/images/hero/slide3.jpg',
    fallback: '/images/hero/slide3.svg',
    alt: 'EV Dealership Interior Experience',
  },
  {
    image: '/images/hero/slide4.jpg',
    fallback: '/images/hero/slide4.svg',
    alt: 'Investor Partnership Meeting',
  },
  {
    image: '/images/hero/slide5.jpg',
    fallback: '/images/hero/slide5.svg',
    alt: 'Ather Investment Opportunity',
  },
];

function SlideImage({ slide, isActive }: { slide: Slide; isActive: boolean }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    if (!isActive) return;
    setState('loading');
    const img = new Image();
    img.onload = () => setState('loaded');
    img.onerror = () => setState('error');
    img.src = slide.image;
  }, [slide.image, isActive]);

  return (
    <div className="absolute inset-0">
      {state === 'error' || state === 'loading' ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.fallback})` }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out"
          style={{
            backgroundImage: `url(${slide.image})`,
            transform: isActive ? 'scale(1.08)' : 'scale(1)',
          }}
        />
      )}
      <img
        ref={imgRef}
        src={slide.image}
        alt={slide.alt}
        className="hidden"
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
      />
    </div>
  );
}

export function HeroSection() {
  const { setViewMode } = useAppStore();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(goToNext, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goToNext, isPaused]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section id="home" className="relative w-full h-[90vh] md:h-[90vh] overflow-hidden bg-gray-900">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <SlideImage slide={slides[current]} isActive={true} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[3] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col"
          >
            <span className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-white/90 text-xs font-semibold uppercase tracking-[0.2em] mb-6 border border-white/10">
              India&apos;s #1 EV Dealership Opportunity
            </span>

            <p className="text-sm text-gray-400 uppercase tracking-[0.3em] font-medium mb-2">
              START YOUR
            </p>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] text-white"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.3)' }}
            >
              Ather Energy
              <br />
              Dealership Journey
            </h1>

            <p className="text-base md:text-lg text-white/80 max-w-xl mt-6 leading-relaxed">
              Partner with India&apos;s leading electric mobility brand and build a profitable future-ready business.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
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
            </div>
          </motion.div>
        </div>
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-3 md:left-6 z-20 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/25 transition-all flex items-center justify-center text-white/80 hover:text-white cursor-pointer border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 md:right-6 z-20 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/25 transition-all flex items-center justify-center text-white/80 hover:text-white cursor-pointer border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              index === current
                ? 'bg-white w-8 h-2.5'
                : 'bg-white/40 w-2.5 h-2.5 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="ml-2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
          aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
        >
          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        </button>
      </div>
    </section>
  );
}
