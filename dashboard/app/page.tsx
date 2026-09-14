'use client';

import { useState } from 'react';
import {
  useProjectData,
  useDailyAggregates,
  useFamilyDailyForecasts,
  useModelImprovement,
} from '@/lib/data/hooks';
import CursorGlow from '@/components/ui/CursorGlow';
import NavigationBar from '@/components/ui/NavigationBar';
import HeroSection from '@/components/hero/HeroSection';
import NextSixteenDays from '@/components/forecast/NextSixteenDays';
import DemandPulse from '@/components/forecast/DemandPulse';
import ProductUniverse from '@/components/products/ProductUniverse';
import InventoryIntel from '@/components/inventory/InventoryIntel';
import RiskField from '@/components/risk/RiskField';
import ModelIntelligence from '@/components/model/ModelIntelligence';
import FinalInsight from '@/components/FinalInsight';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const data = useProjectData();
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  const dailyAggregates = useDailyAggregates(data.forecasts);
  const familyForecasts = useFamilyDailyForecasts(data.forecasts, selectedFamily);
  const { xgboost, bestBaseline, maeImprovement } = useModelImprovement(data.models);

  // Loading state
  if (data.loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0F]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={32} className="text-[#F59E0B]" />
        </motion.div>
        <motion.div
          className="mt-6 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-2 w-48 bg-[#12121A] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#F59E0B]/30 rounded-full"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '40%' }}
            />
          </div>
          <p className="text-[#8A8A9A] text-xs tracking-[0.3em] uppercase text-center">
            Loading forecast data
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (data.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0F] px-6">
        <div className="bg-[#12121A] border border-[#EF4444]/20 rounded-2xl p-10 max-w-lg text-center">
          <p className="text-[#EF4444] text-sm tracking-[0.2em] uppercase mb-4">
            Data Load Error
          </p>
          <p className="text-[#F5F0E8] text-base mb-4">{data.error}</p>
          <p className="text-[#8A8A9A] text-xs">
            Ensure CSV files are available in public/data/
          </p>
        </div>
      </div>
    );
  }

  const totalDemand = data.inventorySummary?.total_forecast_demand ?? 0;

  return (
    <main className="relative min-h-screen">
      <CursorGlow />
      <NavigationBar />

      <HeroSection totalDemand={totalDemand} />

      <NextSixteenDays totalDemand={totalDemand} />

      <DemandPulse
        dailyAggregates={dailyAggregates}
        familyForecasts={familyForecasts}
        selectedFamily={selectedFamily}
      />

      <ProductUniverse
        inventory={data.inventory}
        forecasts={data.forecasts}
        selectedFamily={selectedFamily}
        onSelectFamily={setSelectedFamily}
      />

      {data.inventorySummary && (
        <InventoryIntel summary={data.inventorySummary} />
      )}

      <RiskField
        inventory={data.inventory}
        onSelectFamily={(family) => {
          setSelectedFamily(family);
          // Scroll to products section to show detail
          if (family) {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        selectedFamily={selectedFamily}
      />

      <ModelIntelligence
        models={data.models}
        maeImprovement={maeImprovement}
        xgboost={xgboost}
        bestBaseline={bestBaseline}
      />

      <FinalInsight />
    </main>
  );
}
