'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { useAppStore } from '@/store/app';

const sectionIds = ['home', 'models', 'features', 'test-ride', 'emi', 'contact'];

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Models', href: '#models' },
  { label: 'Features', href: '#features' },
  { label: 'Test Ride', href: '#test-ride' },
  { label: 'EMI', href: '#emi' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ── Scroll listener ──
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── IntersectionObserver for active section tracking ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [],
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full h-16 md:h-20 transition-all duration-300 ${
        scrolled
          ? 'glass-panel border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="flex items-center justify-between h-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* ── Left: Logo + Brand ── */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 select-none"
        >
          <span
            className="flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full
                       bg-gradient-to-br from-emerald-400 to-cyan-400
                       font-black text-midnight text-sm font-[family-name:var(--font-body)]"
            aria-hidden="true"
          >
            AE
          </span>

          <span className="flex items-center leading-none">
            <span className="text-white font-bold text-lg tracking-[0.15em] font-[family-name:var(--font-body)]">
              ATHER
            </span>
            <span className="text-neon-green font-bold text-lg tracking-[0.15em] font-[family-name:var(--font-body)]">
              ENERGY
            </span>
          </span>
        </a>

        {/* ── Center: Desktop Nav Links ── */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              activeSection === link.href.replace('#', '');
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 text-sm font-medium font-[family-name:var(--font-body)]
                    transition-colors duration-200
                    after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2
                    after:h-[2px] after:bg-gradient-to-r after:from-emerald-400 after:to-cyan-400
                    after:transition-all after:duration-300
                    hover:after:w-2/3
                    ${
                      isActive
                        ? 'text-neon-green nav-link-active after:w-2/3'
                        : 'text-white/70 hover:text-white after:w-0'
                    }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-3">
          {/* Phone number – display only */}
          <span className="hidden lg:inline-flex items-center gap-1.5 text-sm text-muted-foreground font-[family-name:var(--font-body)]">
            <Phone className="h-3.5 w-3.5" />
            Call: +91 98765 43210
          </span>

          {/* Book Test Ride CTA */}
          <a
            href="#test-ride"
            onClick={(e) => handleNavClick(e, '#test-ride')}
            className="btn-neon-green text-sm px-4 py-2 hidden md:inline-flex items-center font-[family-name:var(--font-body)]"
          >
            Book Test Ride
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg
                       text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden glass-panel border-t border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const isActive =
                  activeSection === link.href.replace('#', '');
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium font-[family-name:var(--font-body)]
                      transition-colors ${
                        isActive
                          ? 'text-neon-green bg-white/5'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.label}
                  </motion.a>
                );
              })}

              {/* Phone number in mobile */}
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: navLinks.length * 0.05,
                  duration: 0.2,
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-muted-foreground font-[family-name:var(--font-body)]"
              >
                <Phone className="h-3.5 w-3.5" />
                Call: +91 98765 43210
              </motion.div>

              {/* Book Test Ride button */}
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: (navLinks.length + 1) * 0.05,
                  duration: 0.2,
                }}
                className="pt-2 mt-2 border-t border-white/10"
              >
                <a
                  href="#test-ride"
                  onClick={(e) => handleNavClick(e, '#test-ride')}
                  className="btn-neon-green text-sm px-4 py-2.5 w-full flex items-center justify-center font-[family-name:var(--font-body)]"
                >
                  Book Test Ride
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
