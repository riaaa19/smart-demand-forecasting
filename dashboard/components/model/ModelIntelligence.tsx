'use client';

import { useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from '@/components/ui/CountUp';
import SectionReveal from '@/components/ui/SectionReveal';
import { formatIndianNumber, formatPercent } from '@/lib/formatting/indian-number';
import type { ModelComparison } from '@/types';
import { Brain, Zap, Award } from 'lucide-react';

interface ModelIntelligenceProps {
  models: ModelComparison[];
  maeImprovement: number;
  xgboost: ModelComparison | null;
  bestBaseline: ModelComparison | null;
}

export default function ModelIntelligence({
  models,
  maeImprovement,
  xgboost,
  bestBaseline,
}: ModelIntelligenceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const maxMAE = useMemo(
    () => Math.max(...models.map((m) => m.MAE), 1),
    [models]
  );

  // Order: XGBoost first, then baselines sorted by MAE
  const ordered = useMemo(() => {
    const xg = models.filter((m) => m.Model.includes('XGBoost'));
    const baselines = models
      .filter((m) => !m.Model.includes('XGBoost'))
      .sort((a, b) => a.MAE - b.MAE);
    return [...xg, ...baselines];
  }, [models]);

  return (
    <section id="model" className="relative py-20 md:py-28">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <Brain size={14} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-xs tracking-[0.4em] uppercase font-medium">
              Model Intelligence
            </span>
          </div>
          <h2
            className="text-[#F5F0E8] font-bold tracking-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Why XGBoost?
          </h2>
          <p className="text-[#8A8A9A] text-base max-w-xl mb-16">
            Four models were evaluated on chronological validation data. XGBoost
            achieved the lowest Mean Absolute Error, significantly outperforming
            all statistical baselines.
          </p>
        </SectionReveal>

        {/* Improvement badge */}
        {xgboost && bestBaseline && (
          <SectionReveal delay={0.15}>
            <motion.div
              className="inline-flex items-center gap-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full px-6 py-3 mb-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Zap size={16} className="text-[#F59E0B]" />
              <span className="text-[#F5F0E8] text-sm">
                XGBoost reduced MAE by{' '}
                <span className="text-[#F59E0B] font-bold">
                  <CountUp target={maeImprovement} duration={1.5} decimals={1} suffix="%" className="inline" />
                </span>
                {' '}vs. {bestBaseline.Model}
              </span>
            </motion.div>
          </SectionReveal>
        )}

        {/* Model tracks */}
        <div className="space-y-8">
          {ordered.map((model, i) => {
            const isXGB = model.Model.includes('XGBoost');
            const barWidth = ((maxMAE - model.MAE) / maxMAE) * 100;

            return (
              <SectionReveal key={model.Model} delay={0.2 + i * 0.1}>
                <div className="group">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-3">
                    <div className="md:w-64 flex-shrink-0 flex items-center gap-3">
                      {isXGB && <Award size={16} className="text-[#F59E0B]" />}
                      <span
                        className={`text-sm font-medium ${
                          isXGB ? 'text-[#F59E0B]' : 'text-[#F5F0E8]'
                        }`}
                      >
                        {model.Model}
                      </span>
                    </div>
                    <div className="flex gap-6 md:gap-10 text-xs">
                      <div>
                        <span className="text-[#8A8A9A] tracking-[0.1em] uppercase">MAE </span>
                        <span className="text-[#F5F0E8] font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {formatIndianNumber(Math.round(model.MAE))}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8A8A9A] tracking-[0.1em] uppercase">RMSE </span>
                        <span className="text-[#F5F0E8] font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {formatIndianNumber(Math.round(model.RMSE))}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8A8A9A] tracking-[0.1em] uppercase">MAPE </span>
                        <span className="text-[#F5F0E8] font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {formatPercent(model['MAPE (%)'], 1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance bar (inverted — lower MAE = wider bar = better) */}
                  <div className="h-4 bg-[#12121A] rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className={`h-full rounded-full ${
                        isXGB
                          ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]'
                          : 'bg-[#8A8A9A]/20'
                      }`}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${Math.max(barWidth, 5)}%` } : {}}
                      transition={{
                        delay: 0.5 + i * 0.15,
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>

        {/* Bar explanation */}
        <SectionReveal delay={0.8}>
          <p className="text-[#8A8A9A] text-[10px] tracking-[0.1em] uppercase mt-6">
            Bar length represents model accuracy (longer = lower MAE = better)
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
