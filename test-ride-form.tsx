'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  Bike,
  MessageSquare,
  CheckCircle2,
  Loader2,
  ChevronDown,
} from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  model: string;
  date: string;
  time: string;
  message: string;
}

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  model?: string;
  date?: string;
  time?: string;
}

const modelOptions = [
  { value: '', label: 'Select Model' },
  { value: '450x', label: 'Ather 450X Gen 3' },
  { value: '450s', label: 'Ather 450S' },
  { value: 'rizta', label: 'Ather Rizta' },
];

const timeSlots = [
  { value: '', label: 'Select Time' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '11:00 AM', label: '11:00 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '2:00 PM', label: '2:00 PM' },
  { value: '3:00 PM', label: '3:00 PM' },
  { value: '4:00 PM', label: '4:00 PM' },
  { value: '5:00 PM', label: '5:00 PM' },
];

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function TestRideForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    model: '',
    date: '',
    time: '',
    message: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = useCallback((): Errors => {
    const newErrors: Errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit Indian mobile number';
    }

    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.model) {
      newErrors.model = 'Please select a model';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a future date';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(formData.date + 'T00:00:00');
      if (selected < today) {
        newErrors.date = 'Please select a future date';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time slot';
    }

    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
          setFormData({
            name: '',
            phone: '',
            email: '',
            model: '',
            date: '',
            time: '',
            message: '',
          });
          setIsSubmitted(false);
        }, 3000);
      }, 2000);
    },
    [validate]
  );

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof Errors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  return (
    <section
      id="test-ride"
      ref={sectionRef}
      className="py-20 md:py-28 relative"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(0,255,136,0.03) 0%, transparent 70%)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <h2 className="gradient-text-green text-3xl md:text-5xl font-[family-name:var(--font-heading)]">
            Book a Free Test Ride
          </h2>
          <p className="text-muted-foreground mt-4 text-center">
            Experience the future of mobility. No charges, no commitment.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="glass-card-static p-6 md:p-10 mt-12"
            >
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="form-label">
                      <User className="inline-block h-3.5 w-3.5 mr-1.5 opacity-60" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className={`form-input-dark${errors.name ? ' error' : ''}`}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                    />
                    {errors.name && (
                      <div className="form-error">{errors.name}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="form-label">
                      <Phone className="inline-block h-3.5 w-3.5 mr-1.5 opacity-60" />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      className={`form-input-dark${errors.phone ? ' error' : ''}`}
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                    />
                    {errors.phone && (
                      <div className="form-error">{errors.phone}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="form-label">
                      <Mail className="inline-block h-3.5 w-3.5 mr-1.5 opacity-60" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-input-dark${errors.email ? ' error' : ''}`}
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                    />
                    {errors.email && (
                      <div className="form-error">{errors.email}</div>
                    )}
                  </div>

                  {/* Model Select */}
                  <div>
                    <label className="form-label">
                      <Bike className="inline-block h-3.5 w-3.5 mr-1.5 opacity-60" />
                      Select Model
                    </label>
                    <div className="relative">
                      <select
                        className={`form-input-dark appearance-none pr-10${errors.model ? ' error' : ''}`}
                        value={formData.model}
                        onChange={(e) =>
                          handleInputChange('model', e.target.value)
                        }
                      >
                        {modelOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {errors.model && (
                      <div className="form-error">{errors.model}</div>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="form-label">
                      <CalendarDays className="inline-block h-3.5 w-3.5 mr-1.5 opacity-60" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      min={getTodayString()}
                      className={`form-input-dark${errors.date ? ' error' : ''}`}
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange('date', e.target.value)
                      }
                    />
                    {errors.date && (
                      <div className="form-error">{errors.date}</div>
                    )}
                  </div>

                  {/* Time Select */}
                  <div>
                    <label className="form-label">
                      <Clock className="inline-block h-3.5 w-3.5 mr-1.5 opacity-60" />
                      Preferred Time
                    </label>
                    <div className="relative">
                      <select
                        className={`form-input-dark appearance-none pr-10${errors.time ? ' error' : ''}`}
                        value={formData.time}
                        onChange={(e) =>
                          handleInputChange('time', e.target.value)
                        }
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {errors.time && (
                      <div className="form-error">{errors.time}</div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2">
                    <label className="form-label">
                      <MessageSquare className="inline-block h-3.5 w-3.5 mr-1.5 opacity-60" />
                      Additional Message
                    </label>
                    <textarea
                      rows={3}
                      className="form-input-dark resize-none"
                      placeholder="Any specific requirements?"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange('message', e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-start">
                  {isSubmitting ? (
                    <button
                      type="button"
                      disabled
                      className="btn-neon-green w-full md:w-auto py-3 px-8 cursor-not-allowed opacity-70"
                    >
                      <Loader2 className="inline-block h-4 w-4 mr-2 animate-spin" />
                      Booking...
                    </button>
                  ) : isSubmitted ? (
                    <button
                      type="button"
                      disabled
                      className="w-full md:w-auto py-3 px-8 rounded-xl font-bold cursor-not-allowed bg-green-500/20 border border-green-500/30 text-green-400"
                    >
                      <CheckCircle2 className="inline-block h-4 w-4 mr-2" />
                      Test Ride Booked!
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-neon-green w-full md:w-auto py-3 px-8"
                    >
                      Book Free Test Ride
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="glass-card-static p-6 mt-12 text-center"
            >
              <CheckCircle2 className="text-neon-green h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">
                Booking Confirmed!
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                We&apos;ll contact you shortly to confirm your test ride slot.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}