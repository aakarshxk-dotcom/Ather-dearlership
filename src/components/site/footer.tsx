'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

function Instagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Twitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function YouTube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const quickLinks = ['Home', 'About Us', 'Investment', 'Process', 'Apply Now', 'Contact Us'];
const dealershipLinks = ['Why Choose Us', 'ROI Calculator', 'Success Stories', 'FAQ', 'Blog', 'Support'];
const socials = [
  { name: 'Instagram', icon: Instagram },
  { name: 'Twitter', icon: Twitter },
  { name: 'YouTube', icon: YouTube },
  { name: 'LinkedIn', icon: LinkedIn },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 2000);
    } catch {
    }
  };

  return (
    <footer className="bg-[#111827] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-xl">Ather Energy</span>
              <span className="text-emerald-400 font-semibold text-xl">Dealership</span>
            </div>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              India&apos;s premier Ather Energy dealership platform. Helping entrepreneurs build profitable EV businesses since 2019.
            </p>
            <div className="flex gap-2 mt-5">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-emerald-600 transition flex items-center justify-center"
                >
                  <social.icon className="w-4 h-4 text-gray-400 hover:text-white transition" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-5">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-5">
              ATHER ENERGY DEALERSHIP
            </h4>
            <ul className="space-y-2.5">
              {dealershipLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-5">
              NEWSLETTER
            </h4>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Get the latest Ather Energy dealership opportunities delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 flex-1"
              />
              <button
                onClick={handleSubscribe}
                className="bg-emerald-600 hover:bg-emerald-500 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-400 text-xs mt-2"
              >
                Subscribed successfully!
              </motion.p>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Ather Energy Dealership. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Made with ❤️ for Ather Energy Dealership partners across India
          </p>
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-emerald-400 transition">Terms of Service</a>
            <span>|</span>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); (window as unknown as Record<string, unknown>).__adminAccess = undefined; }}
              className="hover:text-emerald-400 transition cursor-pointer hidden"
              id="admin-link"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
