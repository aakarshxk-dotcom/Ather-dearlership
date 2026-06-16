'use client';

import { useAppStore } from '@/store/app';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/site/navbar';
import { HeroSection } from '@/components/site/hero-section';
import { StatsSection, WhyPartnerSection, TrustSection, ProcessSection, InvestmentSection, GalleryPreviewSection, TestimonialsSection, FAQSection, ContactSection } from '@/components/site/home-sections';
import { ROICalculator } from '@/components/site/roi-calculator';
import { ApplicationForm } from '@/components/site/application-form';
import { Footer } from '@/components/site/footer';
import { FloatingButtons } from '@/components/site/floating-buttons';

function Homepage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <WhyPartnerSection />
        <TrustSection />
        <ProcessSection />
        <InvestmentSection />
        <GalleryPreviewSection />
        <TestimonialsSection />
        <ROICalculator />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

export default function Home() {
  const { viewMode } = useAppStore();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        {viewMode === 'home' && <Homepage />}
        {viewMode === 'apply' && <ApplicationForm />}
        {viewMode === 'gallery' && <Homepage />}
        {viewMode === 'admin' && null}
      </motion.div>
    </AnimatePresence>
  );
}
