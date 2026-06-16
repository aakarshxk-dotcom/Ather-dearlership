'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, Send, User, Mail, Phone, MapPin, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/app';

interface FormData {
  fullName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  feedback: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  mobile?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  feedback?: string;
}

const INITIAL: FormData = {
  fullName: '',
  email: '',
  mobile: '',
  whatsapp: '',
  city: '',
  state: '',
  country: 'India',
  pinCode: '',
  feedback: '',
};

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
  'Andaman & Nicobar','Chandigarh','Dadra & Nagar Haveli','Daman & Diu',
  'Lakshadweep','Puducherry',
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email address';
  if (!data.mobile.trim()) errors.mobile = 'Mobile number is required';
  else if (!/^\d{10}$/.test(data.mobile.trim())) errors.mobile = 'Enter a valid 10-digit mobile number';
  if (!data.city.trim()) errors.city = 'City is required';
  if (!data.state.trim()) errors.state = 'State is required';
  if (!data.country.trim()) errors.country = 'Country is required';
  if (!data.pinCode.trim()) errors.pinCode = 'PIN code is required';
  if (!data.feedback.trim()) errors.feedback = 'Feedback / message is required';
  return errors;
}

export function ApplicationForm() {
  const { setViewMode } = useAppStore();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.mobile,
      whatsapp: form.whatsapp || form.mobile,
      city: form.city,
      state: form.state,
      country: form.country,
      pinCode: form.pinCode,
      feedbackMessage: form.feedback,
    };

    console.log('[ApplicationForm] Submitting payload:', payload);

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('[ApplicationForm] API response:', data);

      if (data.success) {
        setSuccess(true);
      } else {
        setSubmitError(data.error || 'Something went wrong');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error. Please try again.';
      console.error('[ApplicationForm] Network error:', err);
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-100 p-8 md:p-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-[#059669]" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] mb-3">
              Application Submitted Successfully
            </h1>
            <p className="text-gray-500 leading-relaxed mb-8">
              Thank you for your interest in becoming an Ather Energy Dealership Partner.
              <br className="my-2" />
              Our team has received your application and will review it shortly.
              <br className="my-2" />
              We will contact you if further information is required.
            </p>
            <button
              onClick={() => { setViewMode('home'); }}
              className="btn-luxury-primary px-8 py-3"
            >
              Return to Homepage
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => setViewMode('home')}
            className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#111827]">Apply For Dealership</h1>
            <p className="text-sm text-gray-400">Fill in your details below</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-100 overflow-hidden"
        >
          <div className="h-1.5 bg-gradient-to-r from-[#059669] to-[#10B981]" />

          {submitError && (
            <div className="mx-6 md:mx-10 mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Submission failed</p>
                <p className="text-red-600 text-xs mt-0.5">{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <User className="w-4 h-4 text-gray-400" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={`w-full bg-gray-50 border ${errors.fullName ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full bg-gray-50 border ${errors.email ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={form.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, ''))}
                    className={`w-full bg-gray-50 border ${errors.mobile ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    WhatsApp Number
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    placeholder="Same as mobile (optional)"
                    maxLength={10}
                    value={form.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Location Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="city" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Your city"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={`w-full bg-gray-50 border ${errors.city ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className={`w-full bg-gray-50 border ${errors.state ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition appearance-none cursor-pointer`}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="country" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className={`w-full bg-gray-50 border ${errors.country ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                <div>
                  <label htmlFor="pinCode" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pinCode"
                    type="text"
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    value={form.pinCode}
                    onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, ''))}
                    className={`w-full bg-gray-50 border ${errors.pinCode ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition`}
                  />
                  {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div>
              <label htmlFor="feedback" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                Feedback / Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="feedback"
                rows={5}
                placeholder="Tell us about your interest in the Ather Energy dealership opportunity..."
                value={form.feedback}
                onChange={(e) => handleChange('feedback', e.target.value)}
                className={`w-full bg-gray-50 border ${errors.feedback ? 'border-red-400 ring-2 ring-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition resize-none`}
              />
              {errors.feedback && <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#059669] to-[#047857] text-white font-semibold rounded-xl px-8 py-4 text-base shadow-[0_8px_30px_rgba(5,150,105,0.3)] hover:shadow-[0_12px_40px_rgba(5,150,105,0.4)] hover:from-[#047857] hover:to-[#065f46] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
