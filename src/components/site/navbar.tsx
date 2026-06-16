'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronRight, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/app';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Why Ather', href: '#why-ather' },
  { label: 'Investment', href: '#investment' },
  { label: 'Process', href: '#process' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
] as const;

export default function Navbar() {
  const { setViewMode, adminAuthenticated, adminName, setAdminAuthenticated, authChecked } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        setAdminAuthenticated(d.authenticated, d.user?.name || 'Admin');
      })
      .catch(() => setAdminAuthenticated(false));
  }, [setAdminAuthenticated]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace('#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    },
    []
  );

  const handleApplyClick = useCallback(() => {
    setMobileOpen(false);
    setViewMode('apply');
  }, [setViewMode]);

  const handleDashboardClick = useCallback(() => {
    setMobileOpen(false);
    window.location.href = '/admin/dashboard';
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAdminAuthenticated(false);
    } finally {
      setLoggingOut(false);
      window.location.href = '/';
    }
  }, [setAdminAuthenticated]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 h-20 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex flex-col shrink-0"
          >
            <span className="text-lg font-bold text-slate-900 tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
              ATHER ENERGY
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.25em] leading-none mt-1">
              DEALERSHIP
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-[#059669]' : 'text-gray-500 hover:text-[#059669]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-0.5 bg-[#059669] transition-transform duration-300 origin-center rounded-full ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {adminAuthenticated ? (
              <>
                <span className="hidden md:block text-xs text-gray-400 mr-1">{adminName}</span>
                <button
                  onClick={handleDashboardClick}
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 md:px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 md:px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{loggingOut ? '...' : 'Logout'}</span>
                </button>
              </>
            ) : (
              <a
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-600 hover:text-emerald-600 bg-white/80 hover:bg-white border border-gray-200 hover:border-emerald-300 px-2.5 md:px-4 py-2 rounded-lg transition-all cursor-pointer"
                title="Admin Login"
              >
                <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Admin Sign In</span>
              </a>
            )}

            <button
              onClick={handleApplyClick}
              className="btn-luxury-primary text-xs md:text-sm px-3 md:px-5 py-2 md:py-2.5"
            >
              Apply Now
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#059669] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-20 left-0 right-0 z-40 bg-white shadow-xl border-b border-gray-100 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#059669] bg-emerald-50/60'
                        : 'text-gray-600 hover:text-[#059669] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    {isActive && <ChevronRight className="w-4 h-4 text-[#059669]" />}
                  </a>
                );
              })}

              <hr className="my-2 border-gray-100" />

              {adminAuthenticated ? (
                <>
                  <a
                    href="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    Dashboard
                    <LayoutDashboard className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {loggingOut ? 'Logging out...' : 'Logout'}
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <a
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#059669] hover:bg-gray-50 transition-colors"
                >
                  Admin Sign In
                  <Shield className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={handleApplyClick}
                className="btn-luxury-primary w-full justify-center text-sm px-5 py-3 mt-1"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
