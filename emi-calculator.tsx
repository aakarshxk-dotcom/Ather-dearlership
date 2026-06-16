'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IndianRupee, TrendingDown, Percent, Calendar, ArrowRight } from 'lucide-react';

function formatCurrency(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function EMICalculator() {
  const [price, setPrice] = useState(150000);
  const [downPayment, setDownPayment] = useState(30000);
  const [tenure, setTenure] = useState(36);
  const [interestRate, setInterestRate] = useState(10.5);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const emiResult = useMemo(() => {
    const principal = price - downPayment;
    if (principal <= 0) return { emi: 0, totalAmount: 0, totalInterest: 0, principal: 0 };
    const monthlyRate = interestRate / 12 / 100;
    if (monthlyRate === 0) return { emi: principal / tenure, totalAmount: principal, totalInterest: 0, principal };
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;
    return { emi, totalAmount, totalInterest, principal };
  }, [price, downPayment, tenure, interestRate]);

  const handlePriceChange = (value: number) => {
    setPrice(value);
    if (downPayment > value) {
      setDownPayment(value);
    }
  };

  const sliderData = [
    {
      icon: <IndianRupee className="h-4 w-4" />,
      label: 'Ex-showroom Price',
      value: formatCurrency(price),
      min: 50000,
      max: 250000,
      step: 5000,
      currentValue: price,
      onChange: handlePriceChange,
      rangeText: '₹50,000 — ₹2,50,000',
    },
    {
      icon: <IndianRupee className="h-4 w-4" />,
      label: 'Down Payment',
      value: formatCurrency(downPayment),
      min: 0,
      max: price,
      step: 5000,
      currentValue: downPayment,
      onChange: setDownPayment,
      rangeText: `₹0 — ${formatCurrency(price)}`,
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: 'Loan Tenure',
      value: `${tenure} months`,
      min: 12,
      max: 60,
      step: 6,
      currentValue: tenure,
      onChange: setTenure,
      rangeText: '12 — 60 months',
    },
    {
      icon: <Percent className="h-4 w-4" />,
      label: 'Interest Rate',
      value: `${interestRate}% p.a.`,
      min: 5,
      max: 18,
      step: 0.5,
      currentValue: interestRate,
      onChange: setInterestRate,
      rangeText: '5% — 18%',
    },
  ];

  return (
    <section id="emi" ref={sectionRef} className="py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <h2 className="gradient-text-green text-3xl md:text-5xl font-[family-name:var(--font-heading)]">
            EMI Calculator
          </h2>
          <p className="text-muted-foreground mt-4 text-center">
            Plan your purchase with flexible financing options
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12"
        >
          {/* Left Column — Sliders */}
          <div className="lg:col-span-3">
            <div className="glass-card-static p-6 md:p-8">
              {sliderData.map((slider, index) => (
                <div key={slider.label} className={index < sliderData.length - 1 ? 'mb-6' : 'mb-0'}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-white/80">
                      {slider.icon}
                      {slider.label}
                    </span>
                    <span className="text-neon-green font-semibold text-sm font-mono">
                      {slider.value}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="emi-slider w-full"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={slider.currentValue}
                    onChange={(e) => slider.onChange(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{slider.rangeText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Results */}
          <div className="lg:col-span-2">
            <div className="glass-card-static p-6 md:p-8 h-full flex flex-col">
              <h3 className="text-white font-semibold text-lg mb-6 font-[family-name:var(--font-heading)]">
                Your EMI Breakdown
              </h3>

              <div className="mb-2">
                <p className="text-3xl md:text-4xl font-black neon-text-green font-mono transition-all duration-200">
                  {formatCurrency(emiResult.emi)}
                </p>
                <p className="text-muted-foreground text-sm">per month</p>
              </div>

              <div className="border-t border-white/5 my-5" />

              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80 flex items-center gap-2">
                    <IndianRupee className="h-3.5 w-3.5" />
                    Loan Amount
                  </span>
                  <span className="text-white font-mono transition-all duration-200">
                    {formatCurrency(emiResult.principal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80 flex items-center gap-2">
                    <TrendingDown className="h-3.5 w-3.5" />
                    Total Interest
                  </span>
                  <span className="text-neon-cyan font-mono transition-all duration-200">
                    {formatCurrency(emiResult.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80 flex items-center gap-2">
                    <Percent className="h-3.5 w-3.5" />
                    Total Amount
                  </span>
                  <span className="text-white font-bold font-mono text-lg transition-all duration-200">
                    {formatCurrency(emiResult.totalAmount)}
                  </span>
                </div>
              </div>

              <button className="btn-neon-green w-full mt-6 flex items-center justify-center gap-2">
                Apply for Loan
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .emi-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          cursor: pointer;
        }
        .emi-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.5);
          transition: box-shadow 0.2s ease;
        }
        .emi-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
        }
        .emi-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.5);
        }
        .emi-slider::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
        }
`}</style>
    </section>
  );
}