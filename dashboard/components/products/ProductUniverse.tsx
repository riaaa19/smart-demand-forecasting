'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionReveal from '@/components/ui/SectionReveal';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import type { InventoryRecommendation, FutureForecast, SortMode } from '@/types';
import { Search, ArrowUpDown, Globe } from 'lucide-react';

interface ProductUniverseProps {
  inventory: InventoryRecommendation[];
  forecasts: FutureForecast[];
  selectedFamily: string | null;
  onSelectFamily: (family: string | null) => void;
}

export default function ProductUniverse({
  inventory,
  forecasts,
  selectedFamily,
  onSelectFamily,
}: ProductUniverseProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortMode>('demand-desc');

  const filtered = useMemo(() => {
    let items = [...inventory];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter((r) => r.family.toLowerCase().includes(q));
    }

    switch (sort) {
      case 'demand-desc':
        items.sort((a, b) => b.forecast_demand_16d - a.forecast_demand_16d);
        break;
      case 'demand-asc':
        items.sort((a, b) => a.forecast_demand_16d - b.forecast_demand_16d);
        break;
      case 'safety-desc':
        items.sort((a, b) => b.safety_stock - a.safety_stock);
        break;
      case 'risk-desc':
        items.sort((a, b) => b.risk_ratio - a.risk_ratio);
        break;
    }

    return items;
  }, [inventory, search, sort]);

  const selected = useMemo(
    () => inventory.find((r) => r.family === selectedFamily) || null,
    [inventory, selectedFamily]
  );

  const familyForecasts = useMemo(() => {
    if (!selectedFamily) return [];
    return forecasts
      .filter((f) => f.family === selectedFamily)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [forecasts, selectedFamily]);

  return (
    <section id="products" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-4">
            <Globe size={14} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-xs tracking-[0.4em] uppercase font-medium">
              Product Universe
            </span>
          </div>
          <h2
            className="text-[#F5F0E8] font-bold tracking-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            33 Product Families
          </h2>
          <p className="text-[#8A8A9A] text-base max-w-xl mb-10">
            Each family represents a category of retail products with its own demand pattern,
            forecast trajectory, and inventory requirement.
          </p>
        </SectionReveal>

        {/* Controls */}
        <SectionReveal delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A9A]" />
              <input
                type="text"
                placeholder="Search families..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#12121A] border border-white/5 rounded-lg pl-10 pr-4 py-3 text-[#F5F0E8] text-sm placeholder-[#8A8A9A]/50 focus:outline-none focus:border-[#F59E0B]/30 transition-colors"
                id="product-search"
              />
            </div>
            <div className="relative">
              <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A9A]" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="bg-[#12121A] border border-white/5 rounded-lg pl-10 pr-8 py-3 text-[#F5F0E8] text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#F59E0B]/30 transition-colors"
                id="product-sort"
              >
                <option value="demand-desc">Highest Demand</option>
                <option value="demand-asc">Lowest Demand</option>
                <option value="safety-desc">Highest Safety Stock</option>
                <option value="risk-desc">Highest Risk</option>
              </select>
            </div>
            {selectedFamily && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onSelectFamily(null)}
                className="px-4 py-3 text-xs tracking-[0.15em] uppercase text-[#F59E0B] border border-[#F59E0B]/20 rounded-lg hover:bg-[#F59E0B]/10 transition-colors"
              >
                Clear Selection
              </motion.button>
            )}
          </div>
        </SectionReveal>

        {/* Product detail */}
        <AnimatePresence mode="wait">
          {selected && (
            <ProductDetail
              key={selected.family}
              recommendation={selected}
              forecasts={familyForecasts}
            />
          )}
        </AnimatePresence>

        {/* Product grid */}
        <SectionReveal delay={0.3}>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            layout
          >
            <AnimatePresence>
              {filtered.map((item, i) => (
                <ProductCard
                  key={item.family}
                  recommendation={item}
                  isSelected={item.family === selectedFamily}
                  onClick={() =>
                    onSelectFamily(
                      item.family === selectedFamily ? null : item.family
                    )
                  }
                  index={i}
                  maxDemand={inventory[0]?.forecast_demand_16d || 1}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
