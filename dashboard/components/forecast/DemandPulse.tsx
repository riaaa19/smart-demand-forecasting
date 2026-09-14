'use client';

import { useMemo, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { formatIndianNumber, formatAxisTick } from '@/lib/formatting/indian-number';
import SectionReveal from '@/components/ui/SectionReveal';
import type { DailyAggregate, FamilyDailyForecast } from '@/types';
import { Activity } from 'lucide-react';

interface DemandPulseProps {
  dailyAggregates: DailyAggregate[];
  familyForecasts: FamilyDailyForecast[];
  selectedFamily: string | null;
}

function CustomTooltip({ active, payload, label, selectedFamily }: any) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const dateStr = new Date(label + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#1A1A25] border border-[#F59E0B]/20 rounded-lg px-5 py-4 shadow-2xl"
    >
      <p className="text-[#8A8A9A] text-xs tracking-[0.15em] uppercase mb-1">
        {dateStr}
      </p>
      <p className="text-[#F5F0E8] text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatIndianNumber(Math.round(value))}
      </p>
      <p className="text-[#F59E0B] text-xs mt-1">
        {selectedFamily || 'All Families'} — Predicted Demand
      </p>
    </motion.div>
  );
}

export default function DemandPulse({
  dailyAggregates,
  familyForecasts,
  selectedFamily,
}: DemandPulseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const chartData = useMemo(() => {
    if (selectedFamily && familyForecasts.length > 0) {
      return familyForecasts.map((d) => ({
        date: d.date,
        value: d.predicted_sales,
      }));
    }
    return dailyAggregates.map((d) => ({
      date: d.date,
      value: d.total_demand,
    }));
  }, [dailyAggregates, familyForecasts, selectedFamily]);

  const maxVal = useMemo(
    () => Math.max(...chartData.map((d) => d.value), 0),
    [chartData]
  );

  return (
    <section className="relative py-16 md:py-24">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <Activity size={14} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-xs tracking-[0.4em] uppercase font-medium">
              Demand Pulse
            </span>
          </div>
          <h2
            className="text-[#F5F0E8] font-bold tracking-tight mb-2"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            {selectedFamily || 'Total'} Daily Forecast
          </h2>
          <p className="text-[#8A8A9A] text-sm mb-10">
            {selectedFamily
              ? `16-day demand trajectory for ${selectedFamily}`
              : 'Aggregated daily demand across all 33 product families'}
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <motion.div
            className="w-full h-[400px] md:h-[500px]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <defs>
                  <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.03)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#8A8A9A', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                  tickFormatter={(v: string) => {
                    const d = new Date(v + 'T00:00:00');
                    return `${d.getDate()} Aug`;
                  }}
                />
                <YAxis
                  tick={{ fill: '#8A8A9A', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatAxisTick}
                  width={80}
                />
                <Tooltip
                  content={<CustomTooltip selectedFamily={selectedFamily} />}
                  cursor={{
                    stroke: '#F59E0B',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                    strokeOpacity: 0.4,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fill="url(#demandGradient)"
                  dot={{
                    r: 4,
                    fill: '#0A0A0F',
                    stroke: '#F59E0B',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: '#F59E0B',
                    stroke: '#0A0A0F',
                    strokeWidth: 3,
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
