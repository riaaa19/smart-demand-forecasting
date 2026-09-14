'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionReveal from '@/components/ui/SectionReveal';
import { staggerContainer, heroWord } from '@/lib/animations/variants';
import { Sparkles } from 'lucide-react';

export default function FinalInsight() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const words = ['DEMAND', 'DECODED.'];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#12121A] to-[#0A0A0F]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <SectionReveal>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles size={14} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-xs tracking-[0.4em] uppercase font-medium">
              The Complete Picture
            </span>
          </div>
        </SectionReveal>

        <motion.div
          className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ perspective: '600px' }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={heroWord}
              className="text-[#F5F0E8] font-extrabold tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <SectionReveal delay={0.4}>
          <p className="text-[#8A8A9A] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-16">
            From raw retail transactions to actionable inventory recommendations —
            this project demonstrates the full lifecycle of an ML-powered demand
            intelligence system.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.6}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: 'Time Series Forecasting', icon: '📈' },
              { label: 'Feature Engineering', icon: '⚙️' },
              { label: 'Uncertainty Estimation', icon: '🎯' },
              { label: 'Inventory Planning', icon: '📦' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="bg-[#12121A] border border-white/5 rounded-xl p-5 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                whileHover={{
                  borderColor: 'rgba(245, 158, 11, 0.2)',
                  y: -4,
                  transition: { duration: 0.2 },
                }}
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-[#F5F0E8] text-xs tracking-[0.1em] uppercase">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </SectionReveal>

        {/* Footer */}
        <SectionReveal delay={1}>
          <div className="mt-20 pt-8 border-t border-white/5">
            <p className="text-[#8A8A9A] text-xs tracking-[0.15em] uppercase">
              Smart Retail Demand Forecasting & Inventory Planner
            </p>
            <p className="text-[#8A8A9A]/50 text-xs mt-2">
              Built with XGBoost · Next.js · Framer Motion · Recharts
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
