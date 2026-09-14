'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { formatIndianNumber } from '@/lib/formatting/indian-number';
import type { InventoryRecommendation } from '@/types';

interface ProductCardProps {
  recommendation: InventoryRecommendation;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  maxDemand: number;
}

const riskColors = {
  LOW: '#22C55E',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
};

export default function ProductCard({
  recommendation: r,
  isSelected,
  onClick,
  index,
  maxDemand,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Determine visual weight: top families get taller cards
  const demandRatio = r.forecast_demand_16d / maxDemand;
  const isLarge = r.demand_rank <= 3;
  const isMedium = r.demand_rank <= 8;

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    const dist = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 1);
    const rotateY = deltaX * dist * 6;
    const rotateX = -deltaY * dist * 6;
    setTilt({ x: rotateX, y: rotateY });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.97 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 200, damping: 20 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300
        ${isLarge ? 'col-span-2 row-span-2' : isMedium ? 'col-span-1 row-span-2' : 'col-span-1'}
        ${isSelected
          ? 'bg-[#F59E0B]/15 border-2 border-[#F59E0B] shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.01]'
          : 'bg-[#12121A] border border-white/5 hover:border-[#F59E0B]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
        }`}
      style={{
        perspective: '800px',
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 0.15s ease-out, border-color 0.3s, background-color 0.3s' : 'transform 0.5s ease-out, border-color 0.3s, background-color 0.3s',
        minHeight: isLarge ? '220px' : isMedium ? '180px' : '140px',
      }}
      role="button"
      aria-label={`Select ${r.family}`}
    >
      {/* Hover ambient backlight */}
      {(isHovered || isSelected) && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/15 via-transparent to-transparent pointer-events-none transition-opacity duration-300" />
      )}

      {/* Demand bar background */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-colors duration-300 ${
          isSelected ? 'bg-[#F59E0B]/15' : 'bg-[#F59E0B]/5'
        }`}
        style={{ height: `${Math.max(demandRatio * 100, 6)}%` }}
      />

      <div className="relative z-10 p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shadow-sm"
                style={{
                  backgroundColor: riskColors[r.risk_category],
                  boxShadow: `0 0 8px ${riskColors[r.risk_category]}66`,
                }}
              />
              <span className="text-[#8A8A9A] text-[10px] tracking-wider uppercase font-medium">
                {r.risk_category}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {isSelected && (
                <span className="bg-[#F59E0B] text-[#0A0A0F] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
              <span className="text-[#8A8A9A] text-[10px]">#{r.demand_rank}</span>
            </div>
          </div>
          <h3 className={`text-[#F5F0E8] font-semibold tracking-tight leading-tight ${
            isLarge ? 'text-lg' : 'text-sm'
          }`}>
            {r.family}
          </h3>
        </div>

        <div className="mt-3">
          <p className="text-[#8A8A9A] text-[10px] tracking-[0.1em] uppercase mb-0.5">
            16-Day Forecast
          </p>
          <p className={`font-bold ${isSelected ? 'text-[#F59E0B]' : 'text-[#F5F0E8]'} ${isLarge ? 'text-xl' : 'text-sm'}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatIndianNumber(r.forecast_demand_16d)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
