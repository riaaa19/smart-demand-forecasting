'use client';

import { motion } from 'framer-motion';
import DemandField from './DemandField';
import CountUp from '@/components/ui/CountUp';
import { heroWord, staggerContainer, fadeUp } from '@/lib/animations/variants';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  totalDemand: number;
}

export default function HeroSection({ totalDemand }: HeroSectionProps) {
  const headline1 = ['SMART', 'RETAIL'];
  const headline2 = ['SEE', 'DEMAND', 'BEFORE', 'IT', 'HAPPENS.'];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background demand field */}
      <div className="absolute inset-0 opacity-60">
        <DemandField />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-transparent to-[#0A0A0F] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/80 via-transparent to-[#0A0A0F]/40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-0">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <span className="text-[#F59E0B] text-xs tracking-[0.4em] uppercase font-medium">
            AI-Powered Demand Intelligence
          </span>
        </motion.div>

        {/* Headline line 1 */}
        <motion.div
          className="flex flex-wrap gap-x-5 gap-y-1 mb-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ perspective: '600px' }}
        >
          {headline1.map((word, i) => (
            <motion.span
              key={i}
              variants={heroWord}
              className="text-[#F5F0E8]/30 font-extrabold tracking-tight"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Headline line 2 */}
        <motion.div
          className="flex flex-wrap gap-x-4 gap-y-1 mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ perspective: '600px' }}
        >
          {headline2.map((word, i) => (
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

        {/* Supporting text */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
          className="text-[#8A8A9A] text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
        >
          AI-powered demand forecasting that transforms retail sales patterns
          into future demand predictions and inventory planning decisions.
        </motion.p>

        {/* Key stat */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[#8A8A9A] text-xs tracking-[0.3em] uppercase mb-2">
            16-Day Forecast Demand
          </p>
          <CountUp
            target={totalDemand}
            duration={2.5}
            suffix=" units"
            className="text-[#F59E0B] text-4xl md:text-5xl font-bold tracking-tight"
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-[#8A8A9A] text-[10px] tracking-[0.3em] uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-[#8A8A9A]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
