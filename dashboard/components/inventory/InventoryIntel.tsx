'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from '@/components/ui/CountUp';
import SectionReveal from '@/components/ui/SectionReveal';
import { formatIndianNumber } from '@/lib/formatting/indian-number';
import type { InventorySummary } from '@/types';
import { Warehouse, Shield, Package } from 'lucide-react';

interface InventoryIntelProps {
  summary: InventorySummary;
}

export default function InventoryIntel({ summary }: InventoryIntelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const totalDemand = summary.total_forecast_demand;
  const safetyStock = summary.total_safety_stock;
  const totalRecommended = summary.total_recommended_inventory;

  const demandPct = (totalDemand / totalRecommended) * 100;
  const safetyPct = (safetyStock / totalRecommended) * 100;

  return (
    <section id="inventory" className="relative py-20 md:py-28">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <Warehouse size={14} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-xs tracking-[0.4em] uppercase font-medium">
              Inventory Intelligence
            </span>
          </div>
          <h2
            className="text-[#F5F0E8] font-bold tracking-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Portfolio Inventory Equation
          </h2>
          <p className="text-[#8A8A9A] text-base max-w-2xl mb-12">
            Demonstrating how ML forecast demand combines with model uncertainty buffers
            (6.58× validation standard deviation at 99.75% service level) to derive total recommended inventory.
          </p>
        </SectionReveal>

        {/* Dynamic Formula Pill Banner */}
        <SectionReveal delay={0.15}>
          <div className="bg-[#12121A] border border-[#F59E0B]/20 rounded-2xl p-6 mb-12 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Equation Part 1: Forecast Demand */}
              <div className="flex-1 text-center lg:text-left">
                <span className="text-[#8A8A9A] text-[10px] tracking-[0.2em] uppercase font-semibold block mb-1">
                  1. Baseline Demand Forecast
                </span>
                <p className="text-[#F5F0E8] text-2xl md:text-3xl font-bold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatIndianNumber(totalDemand)} <span className="text-xs text-[#8A8A9A] font-normal">units</span>
                </p>
                <span className="inline-block mt-1 text-[11px] text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-0.5 rounded-full font-medium">
                  {demandPct.toFixed(1)}% of total
                </span>
              </div>

              {/* Plus Operator */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A25] border border-[#F59E0B]/30 text-[#F59E0B] font-bold text-xl flex-shrink-0 shadow-lg">
                +
              </div>

              {/* Equation Part 2: Safety Stock */}
              <div className="flex-1 text-center lg:text-left">
                <span className="text-[#8A8A9A] text-[10px] tracking-[0.2em] uppercase font-semibold block mb-1">
                  2. Safety Buffer (Uncertainty)
                </span>
                <p className="text-[#F5F0E8] text-2xl md:text-3xl font-bold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatIndianNumber(safetyStock)} <span className="text-xs text-[#8A8A9A] font-normal">units</span>
                </p>
                <span className="inline-block mt-1 text-[11px] text-[#F59E0B]/80 bg-[#F59E0B]/10 px-2.5 py-0.5 rounded-full font-medium">
                  {safetyPct.toFixed(1)}% of total
                </span>
              </div>

              {/* Equals Operator */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F59E0B] text-[#0A0A0F] font-bold text-xl flex-shrink-0 shadow-lg shadow-[#F59E0B]/20">
                =
              </div>

              {/* Equation Result: Recommended Stock */}
              <div className="flex-1 text-center lg:text-left bg-[#1A1A25] p-4 rounded-xl border border-[#F59E0B]/30">
                <span className="text-[#F59E0B] text-[10px] tracking-[0.2em] uppercase font-bold block mb-1">
                  3. Recommended Inventory
                </span>
                <p className="text-[#F59E0B] text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatIndianNumber(totalRecommended)} <span className="text-xs text-[#8A8A9A] font-normal">units</span>
                </p>
                <span className="inline-block mt-1 text-[11px] text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full font-medium">
                  Optimized Stocking Level
                </span>
              </div>
            </div>

            {/* Synchronized Stacked Equation Bar */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between text-xs text-[#8A8A9A] mb-2 font-medium">
                <span>Synchronized Composition Bar</span>
                <span>100% Recommended Coverage</span>
              </div>
              <div className="h-7 bg-[#0A0A0F] rounded-xl overflow-hidden flex p-1 border border-white/10 gap-1">
                {/* Demand Segment */}
                <motion.div
                  className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center text-[10px] font-bold text-[#0A0A0F] overflow-hidden"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${demandPct}%` } : {}}
                  transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="truncate px-2">Demand Forecast ({demandPct.toFixed(1)}%)</span>
                </motion.div>

                {/* Safety Buffer Segment */}
                <motion.div
                  className="h-full bg-[#B45309]/50 border border-[#F59E0B]/30 rounded-lg flex items-center justify-center text-[10px] font-bold text-[#F5F0E8] overflow-hidden"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${safetyPct}%` } : {}}
                  transition={{ delay: 0.7, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="truncate px-2">Buffer ({safetyPct.toFixed(1)}%)</span>
                </motion.div>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Risk Category Distribution */}
        <SectionReveal delay={0.45}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#12121A] border border-white/5 hover:border-[#22C55E]/30 rounded-xl p-6 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#22C55E] text-xs tracking-[0.2em] uppercase font-semibold">Low Risk Families</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
              </div>
              <p className="text-[#F5F0E8] text-4xl font-bold mb-1">{summary.num_low_risk}</p>
              <p className="text-[#8A8A9A] text-xs leading-relaxed">
                Stable demand patterns with low forecast uncertainty (risk ratio &lt; 10%).
              </p>
            </div>

            <div className="bg-[#12121A] border border-white/5 hover:border-[#F59E0B]/30 rounded-xl p-6 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#F59E0B] text-xs tracking-[0.2em] uppercase font-semibold">Medium Risk Families</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
              </div>
              <p className="text-[#F5F0E8] text-4xl font-bold mb-1">{summary.num_medium_risk}</p>
              <p className="text-[#8A8A9A] text-xs leading-relaxed">
                Moderate variance requiring proportional safety stock (10% ≤ risk ratio &lt; 20%).
              </p>
            </div>

            <div className="bg-[#12121A] border border-white/5 hover:border-[#EF4444]/30 rounded-xl p-6 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#EF4444] text-xs tracking-[0.2em] uppercase font-semibold">High Risk Families</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" />
              </div>
              <p className="text-[#F5F0E8] text-4xl font-bold mb-1">{summary.num_high_risk}</p>
              <p className="text-[#8A8A9A] text-xs leading-relaxed">
                High relative uncertainty; requires expanded buffer stock to guarantee service level (risk ratio ≥ 20%).
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
