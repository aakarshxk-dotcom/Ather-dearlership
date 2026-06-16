'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IndianRupee, Calculator, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/app';

function formatLakh(val: number): string {
  return '₹' + val + ' Lakh';
}

export function ROICalculator() {
  const { setViewMode } = useAppStore();

  const [investmentAmount, setInvestmentAmount] = useState(30);
  const [monthlyRevenue, setMonthlyRevenue] = useState(15);
  const [monthlyExpenses, setMonthlyExpenses] = useState(10);
  const [growthRate, setGrowthRate] = useState(12);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const results = useMemo(() => {
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    const annualProfit = monthlyProfit * 12;
    const investmentTotal = investmentAmount * 100000;
    const monthlyProfitTotal = monthlyProfit * 100000;

    const roiPercent = investmentTotal > 0
      ? (annualProfit * 100000 / investmentTotal)
      : 0;

    const breakEvenMonths = monthlyProfit > 0
      ? Math.round(investmentAmount / monthlyProfit * 12)
      : Infinity;

    const fiveYearProfit = annualProfit * 5 * (1 + growthRate / 100);

    return {
      monthlyProfit,
      annualProfit,
      roiPercent,
      breakEvenMonths,
      fiveYearProfit,
    };
  }, [investmentAmount, monthlyRevenue, monthlyExpenses, growthRate]);

  const getRoiColor = (roi: number): string => {
    if (roi > 20) return 'text-emerald-600';
    if (roi > 10) return 'text-amber-600';
    return 'text-red-500';
  };

  const getRoiBg = (roi: number): string => {
    if (roi > 20) return 'bg-emerald-50';
    if (roi > 10) return 'bg-amber-50';
    return 'bg-red-50';
  };

  const sliders = [
    {
      label: 'Investment Amount',
      value: formatLakh(investmentAmount),
      min: 25,
      max: 100,
      step: 5,
      currentValue: investmentAmount,
      onChange: setInvestmentAmount,
      rangeText: '₹25 Lakh — ₹100 Lakh',
      icon: <IndianRupee className="h-4 w-4 text-emerald-600" />,
    },
    {
      label: 'Monthly Revenue',
      value: formatLakh(monthlyRevenue) + '/mo',
      min: 5,
      max: 30,
      step: 1,
      currentValue: monthlyRevenue,
      onChange: setMonthlyRevenue,
      rangeText: '₹5 Lakh — ₹30 Lakh/month',
      icon: <Calculator className="h-4 w-4 text-emerald-600" />,
    },
    {
      label: 'Monthly Expenses',
      value: formatLakh(monthlyExpenses) + '/mo',
      min: 3,
      max: 20,
      step: 1,
      currentValue: monthlyExpenses,
      onChange: setMonthlyExpenses,
      rangeText: '₹3 Lakh — ₹20 Lakh/month',
      icon: <IndianRupee className="h-4 w-4 text-amber-600" />,
    },
    {
      label: 'Annual Growth Rate',
      value: growthRate + '%',
      min: 5,
      max: 30,
      step: 1,
      currentValue: growthRate,
      onChange: setGrowthRate,
      rangeText: '5% — 30%',
      icon: <Calculator className="h-4 w-4 text-blue-600" />,
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <h2 className="gradient-text text-3xl md:text-4xl lg:text-5xl font-bold">
            Ather Energy Dealership ROI Calculator
          </h2>
          <p className="text-slate-500 mt-4 text-center max-w-2xl mx-auto">
            Estimate your returns based on investment and revenue projections
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              {sliders.map((slider, index) => (
                <div
                  key={slider.label}
                  className={index < sliders.length - 1 ? 'mb-8' : 'mb-0'}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      {slider.icon}
                      {slider.label}
                    </span>
                    <span className="text-emerald-700 font-bold text-sm font-mono bg-emerald-50 px-3 py-1 rounded-lg">
                      {slider.value}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="calc-slider w-full"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={slider.currentValue}
                    onChange={(e) => slider.onChange(Number(e.target.value))}
                  />
                  <p className="text-xs text-slate-400 mt-2">{slider.rangeText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 h-full flex flex-col">
              <h3 className="text-slate-900 font-bold text-lg mb-6">
                Projected Returns
              </h3>

              {/* Monthly Profit — Highlighted */}
              <div className="mb-6">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                  Monthly Profit
                </p>
                <p className="text-3xl font-black text-[#059669] font-mono">
                  {results.monthlyProfit > 0 ? formatLakh(results.monthlyProfit) + '/mo' : '₹0'}
                </p>
              </div>

              <div className="border-t border-slate-100 my-2" />

              {/* Annual Profit */}
              <div className="py-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                  Annual Profit
                </p>
                <p className="text-xl font-bold text-slate-900 font-mono">
                  {results.annualProfit > 0 ? formatLakh(results.annualProfit) : '₹0'}
                </p>
              </div>

              {/* ROI */}
              <div className={`rounded-xl p-4 my-3 ${getRoiBg(results.roiPercent)}`}>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                  Return on Investment
                </p>
                <p className={`text-2xl font-black font-mono ${getRoiColor(results.roiPercent)}`}>
                  {results.roiPercent.toFixed(1)}%
                </p>
              </div>

              {/* Break-even */}
              <div className="py-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                  Break-even Period
                </p>
                <p className="text-lg font-bold text-slate-900 font-mono">
                  {results.breakEvenMonths === Infinity ? 'N/A' : `${results.breakEvenMonths} Months`}
                </p>
              </div>

              {/* 5-Year Profit */}
              <div className="py-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                  5-Year Projected Profit
                </p>
                <p className="text-lg font-bold text-emerald-700 font-mono">
                  {results.fiveYearProfit > 0 ? formatLakh(Math.round(results.fiveYearProfit)) : '₹0'}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="border-t border-slate-100 mt-4 pt-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-medium">Disclaimer:</span> These are estimated projections.
                  Actual results may vary based on location, market conditions, and operational
                  efficiency.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => setViewMode('apply')}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-sm"
              >
                Apply for Ather Dealership
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
