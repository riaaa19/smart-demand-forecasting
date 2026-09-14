'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from '@/components/ui/CountUp';
import SectionReveal from '@/components/ui/SectionReveal';
import { Calendar, TrendingUp } from 'lucide-react';

interface NextSixteenDaysProps {
  totalDemand: number;
}

export default function NextSixteenDays({ totalDemand }: NextSixteenDaysProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="forecast" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#F59E0B]/20 to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={14} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-xs tracking-[0.4em] uppercase font-medium">
              The Next 16 Days
            </span>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <h2 className="text-[#F5F0E8] font-bold tracking-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Total Forecast Demand
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12 mb-8">
            <div style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              <CountUp
                target={totalDemand}
                duration={2.5}
                suffix=" units"
                className="text-[#F59E0B] font-bold tracking-tight"
              />
            </div>
            <div className="flex items-center gap-4 pb-2">
              <div className="flex items-center gap-2 text-[#8A8A9A]">
                <TrendingUp size={14} />
                <span className="text-xs tracking-[0.2em] uppercase">
                  Aug 16 — Aug 31, 2017
                </span>
              </div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.45}>
          <p className="text-[#8A8A9A] text-base md:text-lg max-w-2xl leading-relaxed">
            XGBoost recursive multi-step forecasting across 33 product families,
            predicting daily demand for each family one day at a time.
          </p>
        </SectionReveal>

        {/* Animated divider */}
        <motion.div
          className="mt-20 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  );
}
