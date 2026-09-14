'use client';

import { useMemo, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ZAxis,
} from 'recharts';
import SectionReveal from '@/components/ui/SectionReveal';
import { formatIndianNumber } from '@/lib/formatting/indian-number';
import type { InventoryRecommendation } from '@/types';
import { AlertTriangle, Info } from 'lucide-react';

interface RiskFieldProps {
  inventory: InventoryRecommendation[];
  onSelectFamily: (family: string | null) => void;
  selectedFamily: string | null;
}

const riskColors: Record<string, string> = {
  LOW: '#22C55E',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
};

function RiskTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#1A1A25] border border-[#F59E0B]/20 rounded-lg px-5 py-4 shadow-2xl">
      <p className="text-[#F5F0E8] font-bold text-base mb-2">{d.family}</p>
      <div className="space-y-1 text-xs">
        <p className="text-[#8A8A9A]">
          Forecast: <span className="text-[#F5F0E8] font-medium">{formatIndianNumber(d.forecast_demand_16d)}</span>
        </p>
        <p className="text-[#8A8A9A]">
          Risk Ratio: <span className="text-[#F5F0E8] font-medium">{(d.risk_ratio * 100).toFixed(2)}%</span>
        </p>
        <p className="text-[#8A8A9A]">
          Safety Stock: <span className="text-[#F5F0E8] font-medium">{formatIndianNumber(d.safety_stock)}</span>
        </p>
        <p style={{ color: riskColors[d.risk_category] }} className="font-bold">
          {d.risk_category} RISK
        </p>
      </div>
    </div>
  );
}

export default function RiskField({ inventory, onSelectFamily, selectedFamily }: RiskFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const selectedItem = useMemo(
    () => inventory.find((r) => r.family === selectedFamily) || null,
    [inventory, selectedFamily]
  );

  const data = useMemo(() => {
    return inventory.map((r) => ({
      ...r,
      x: Math.max(r.forecast_demand_16d, 1),
      y: r.risk_ratio * 100,
      z: Math.max(Math.sqrt(r.forecast_demand_16d) / 40, 50),
    }));
  }, [inventory]);

  return (
    <section id="risk" className="relative py-20 md:py-28">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={14} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-xs tracking-[0.4em] uppercase font-medium">
              Risk & Uncertainty Field
            </span>
          </div>
          <h2
            className="text-[#F5F0E8] font-bold tracking-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Inventory Planning Risk Matrix
          </h2>
          <p className="text-[#8A8A9A] text-base max-w-2xl mb-8">
            Each point represents one of the 33 product families mapped by forecast demand (X-axis, log scale) versus uncertainty risk ratio (Y-axis).
            Bubble size reflects category volume. Click any point to select.
          </p>
        </SectionReveal>

        {/* Selected Family Risk Banner */}
        {selectedItem && (
          <SectionReveal delay={0.1}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12121A] border-2 border-[#F59E0B] rounded-2xl p-5 mb-8 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: riskColors[selectedItem.risk_category],
                    boxShadow: `0 0 12px ${riskColors[selectedItem.risk_category]}`,
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[#F5F0E8] text-lg font-bold">{selectedItem.family}</h3>
                    <span className="text-[10px] bg-[#1A1A25] text-[#8A8A9A] px-2 py-0.5 rounded uppercase font-semibold">
                      Rank #{selectedItem.demand_rank}
                    </span>
                  </div>
                  <p className="text-[#8A8A9A] text-xs mt-0.5">
                    Forecast: <span className="text-[#F5F0E8] font-bold">{formatIndianNumber(selectedItem.forecast_demand_16d)} units</span> •
                    Safety Buffer: <span className="text-[#F5F0E8] font-bold">{formatIndianNumber(selectedItem.safety_stock)} units</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-[#8A8A9A] uppercase tracking-wider block">Risk Ratio</span>
                  <span className="text-[#F59E0B] text-xl font-extrabold">
                    {(selectedItem.risk_ratio * 100).toFixed(1)}%
                  </span>
                </div>
                <button
                  onClick={() => onSelectFamily(null)}
                  className="text-xs text-[#8A8A9A] hover:text-[#F5F0E8] border border-white/10 rounded-lg px-3 py-1.5 transition-colors"
                >
                  Deselect
                </button>
              </div>
            </motion.div>
          </SectionReveal>
        )}

        {/* Risk legend */}
        <SectionReveal delay={0.15}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#12121A] border border-white/5 rounded-xl px-6 py-3">
            <div className="flex flex-wrap items-center gap-6">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map((cat) => {
                const count = inventory.filter((r) => r.risk_category === cat).length;
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: riskColors[cat],
                        boxShadow: `0 0 8px ${riskColors[cat]}88`,
                      }}
                    />
                    <span className="text-[#F5F0E8] text-xs font-semibold tracking-wider">
                      {cat} <span className="text-[#8A8A9A] font-normal">({count} families)</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <span className="text-[#8A8A9A] text-[11px]">Click point to isolate family profile</span>
          </div>
        </SectionReveal>

        {/* Scatter chart */}
        <SectionReveal delay={0.25}>
          <motion.div
            className="w-full h-[420px] md:h-[500px] bg-[#12121A] border border-white/5 rounded-2xl p-4 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Ambient zone indicator backgrounds */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#EF4444]/5 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#22C55E]/5 to-transparent pointer-events-none" />

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 25, right: 35, bottom: 45, left: 25 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Forecast Demand"
                  scale="log"
                  domain={['auto', 'auto']}
                  tick={{ fill: '#8A8A9A', fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickFormatter={(v: number) => formatIndianNumber(Math.round(v))}
                  label={{
                    value: 'Forecast Demand (16 Days, Log Scale) →',
                    position: 'bottom',
                    fill: '#8A8A9A',
                    fontSize: 11,
                    offset: 25,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Risk Ratio"
                  tick={{ fill: '#8A8A9A', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => v.toFixed(0) + '%'}
                  label={{
                    value: 'Risk Ratio (%) →',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#8A8A9A',
                    fontSize: 11,
                    offset: -5,
                  }}
                  width={55}
                />
                <ZAxis type="number" dataKey="z" range={[60, 500]} />
                <Tooltip content={<RiskTooltip />} cursor={false} />
                <Scatter
                  data={data}
                  animationDuration={1200}
                  onClick={(entry: any) => {
                    if (entry?.family) onSelectFamily(entry.family);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {data.map((entry) => {
                    const isSelected = entry.family === selectedFamily;
                    const baseOpacity = selectedFamily
                      ? isSelected
                        ? 1
                        : 0.2
                      : entry.risk_category === 'HIGH'
                      ? 0.95
                      : entry.risk_category === 'MEDIUM'
                      ? 0.85
                      : 0.65;

                    return (
                      <Cell
                        key={entry.family}
                        fill={riskColors[entry.risk_category]}
                        fillOpacity={baseOpacity}
                        stroke={isSelected ? '#F5F0E8' : riskColors[entry.risk_category]}
                        strokeWidth={isSelected ? 3 : 1}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </SectionReveal>

        {/* Risk thresholds summary */}
        <SectionReveal delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8">
            <div className="bg-[#12121A] border border-[#22C55E]/20 rounded-xl px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-[#22C55E] text-xs tracking-[0.15em] uppercase font-bold">Low Risk</p>
                <p className="text-[#8A8A9A] text-xs mt-0.5">risk_ratio &lt; 10%</p>
              </div>
              <span className="text-[#22C55E] text-xs font-semibold bg-[#22C55E]/10 px-2 py-1 rounded">Optimal</span>
            </div>
            <div className="bg-[#12121A] border border-[#F59E0B]/20 rounded-xl px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-[#F59E0B] text-xs tracking-[0.15em] uppercase font-bold">Medium Risk</p>
                <p className="text-[#8A8A9A] text-xs mt-0.5">10% ≤ risk_ratio &lt; 20%</p>
              </div>
              <span className="text-[#F59E0B] text-xs font-semibold bg-[#F59E0B]/10 px-2 py-1 rounded">Balanced</span>
            </div>
            <div className="bg-[#12121A] border border-[#EF4444]/20 rounded-xl px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-[#EF4444] text-xs tracking-[0.15em] uppercase font-bold">High Risk</p>
                <p className="text-[#8A8A9A] text-xs mt-0.5">risk_ratio ≥ 20%</p>
              </div>
              <span className="text-[#EF4444] text-xs font-semibold bg-[#EF4444]/10 px-2 py-1 rounded">Buffer Focused</span>
            </div>
          </div>
        </SectionReveal>

        {/* Disclaimer */}
        <SectionReveal delay={0.5}>
          <div className="flex items-start gap-3 bg-[#12121A] border border-white/5 rounded-xl p-5 max-w-3xl">
            <Info size={16} className="text-[#8A8A9A] mt-0.5 flex-shrink-0" />
            <p className="text-[#8A8A9A] text-xs leading-relaxed">
              Inventory Planning Risk reflects forecast uncertainty relative to expected demand.
              It is not a measured probability of stockout. The dataset does not provide
              current inventory levels or supplier lead times.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
