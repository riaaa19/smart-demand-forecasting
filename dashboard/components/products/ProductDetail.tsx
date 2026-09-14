'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import CountUp from '@/components/ui/CountUp';
import { formatIndianNumber, formatAxisTick } from '@/lib/formatting/indian-number';
import type { InventoryRecommendation, FutureForecast } from '@/types';
import { Package, Shield, AlertTriangle, TrendingUp } from 'lucide-react';

interface ProductDetailProps {
  recommendation: InventoryRecommendation;
  forecasts: FutureForecast[];
}

const riskColors = {
  LOW: '#22C55E',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
};

function MiniTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A25] border border-[#F59E0B]/20 rounded-lg px-3 py-2 text-xs">
      <p className="text-[#8A8A9A]">{label}</p>
      <p className="text-[#F5F0E8] font-bold">{formatIndianNumber(Math.round(payload[0].value))}</p>
    </div>
  );
}

export default function ProductDetail({ recommendation: r, forecasts }: ProductDetailProps) {
  const chartData = forecasts.map((f) => ({
    date: new Date(f.date + 'T00:00:00').getDate() + ' Aug',
    value: f.predicted_sales,
  }));

  const riskColor = riskColors[r.risk_category];
  const maxBar = r.recommended_stock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="mb-12 overflow-hidden"
    >
      <div className="bg-[#12121A] border border-white/5 rounded-2xl p-8 md:p-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-2"
              layoutId={`family-label-${r.family}`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: riskColor }}
              />
              <span className="text-[#8A8A9A] text-xs tracking-[0.2em] uppercase">
                Rank #{r.demand_rank} · {r.risk_category} Risk
              </span>
            </motion.div>
            <motion.h3
              className="text-[#F5F0E8] font-bold tracking-tight"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
            >
              {r.family}
            </motion.h3>
          </div>
          <div className="text-right">
            <p className="text-[#8A8A9A] text-xs tracking-[0.2em] uppercase mb-1">
              16-Day Forecast
            </p>
            <CountUp
              target={r.forecast_demand_16d}
              duration={1.5}
              suffix=" units"
              className="text-[#F59E0B] text-3xl md:text-4xl font-bold"
            />
          </div>
        </div>

        {/* Chart */}
        <div className="h-[250px] mb-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <defs>
                <linearGradient id={`grad-${r.family}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: '#8A8A9A', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              />
              <YAxis
                tick={{ fill: '#8A8A9A', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatAxisTick}
                width={65}
              />
              <Tooltip content={<MiniTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#F59E0B"
                strokeWidth={2}
                fill={`url(#grad-${r.family})`}
                dot={{ r: 3, fill: '#0A0A0F', stroke: '#F59E0B', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#F59E0B' }}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Relationship */}
        <div className="space-y-6">
          <h4 className="text-[#8A8A9A] text-xs tracking-[0.3em] uppercase flex items-center gap-2">
            <Package size={12} /> Inventory Recommendation
          </h4>

          {/* Expected Demand bar */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[#F5F0E8] text-sm flex items-center gap-2">
                <TrendingUp size={12} className="text-[#F59E0B]" />
                Expected Demand
              </span>
              <span className="text-[#F5F0E8] text-sm font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatIndianNumber(r.forecast_demand_16d)}
              </span>
            </div>
            <div className="h-3 bg-[#1A1A25] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#F59E0B]"
                initial={{ width: 0 }}
                animate={{ width: `${(r.forecast_demand_16d / maxBar) * 100}%` }}
                transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Safety Buffer bar */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[#F5F0E8] text-sm flex items-center gap-2">
                <Shield size={12} className="text-[#F59E0B]/60" />
                Safety Buffer
              </span>
              <span className="text-[#F5F0E8] text-sm font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatIndianNumber(r.safety_stock)}
              </span>
            </div>
            <div className="h-3 bg-[#1A1A25] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#F59E0B]/40"
                initial={{ width: 0 }}
                animate={{ width: `${(r.safety_stock / maxBar) * 100}%` }}
                transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Recommended Inventory bar */}
          <div className="pt-3 border-t border-white/5">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[#F5F0E8] text-sm font-semibold flex items-center gap-2">
                <AlertTriangle size={12} style={{ color: riskColor }} />
                Recommended Inventory
              </span>
              <span className="text-[#F59E0B] text-lg font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatIndianNumber(r.recommended_stock)}
              </span>
            </div>
            <div className="h-4 bg-[#1A1A25] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#B45309]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Risk info */}
          <div className="flex flex-wrap gap-6 pt-4">
            <div>
              <p className="text-[#8A8A9A] text-[10px] tracking-[0.1em] uppercase mb-1">Validation Error σ</p>
              <p className="text-[#F5F0E8] text-sm font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatIndianNumber(Math.round(r.validation_error_std))}
              </p>
            </div>
            <div>
              <p className="text-[#8A8A9A] text-[10px] tracking-[0.1em] uppercase mb-1">Risk Ratio</p>
              <p className="text-[#F5F0E8] text-sm font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {(r.risk_ratio * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-[#8A8A9A] text-[10px] tracking-[0.1em] uppercase mb-1">Risk Category</p>
              <p className="text-sm font-bold" style={{ color: riskColor }}>
                {r.risk_category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
