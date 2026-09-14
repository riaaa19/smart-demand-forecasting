'use client';

import { useState, useEffect, useMemo } from 'react';
import type {
  FutureForecast,
  FamilyForecastSummary,
  InventoryRecommendation,
  InventorySummary,
  ModelComparison,
  DailyAggregate,
  FamilyDailyForecast,
} from '@/types';
import {
  loadFutureForecasts,
  loadFamilySummary,
  loadInventoryRecommendations,
  loadInventorySummary,
  loadModelComparison,
} from './loader';

interface DataState {
  forecasts: FutureForecast[];
  familySummary: FamilyForecastSummary[];
  inventory: InventoryRecommendation[];
  inventorySummary: InventorySummary | null;
  models: ModelComparison[];
  loading: boolean;
  error: string | null;
}

export function useProjectData(): DataState {
  const [data, setData] = useState<DataState>({
    forecasts: [],
    familySummary: [],
    inventory: [],
    inventorySummary: null,
    models: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [forecasts, familySummary, inventory, inventorySummary, models] =
          await Promise.all([
            loadFutureForecasts(),
            loadFamilySummary(),
            loadInventoryRecommendations(),
            loadInventorySummary(),
            loadModelComparison(),
          ]);

        if (!cancelled) {
          setData({
            forecasts,
            familySummary,
            inventory,
            inventorySummary,
            models,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load data',
          }));
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return data;
}

/** Aggregate daily total demand across all families */
export function useDailyAggregates(forecasts: FutureForecast[]): DailyAggregate[] {
  return useMemo(() => {
    const map = new Map<string, number>();
    for (const f of forecasts) {
      map.set(f.date, (map.get(f.date) || 0) + f.predicted_sales);
    }
    return Array.from(map.entries())
      .map(([date, total_demand]) => ({ date, total_demand }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [forecasts]);
}

/** Get daily forecasts for a specific family */
export function useFamilyDailyForecasts(
  forecasts: FutureForecast[],
  family: string | null
): FamilyDailyForecast[] {
  return useMemo(() => {
    if (!family) return [];
    return forecasts
      .filter((f) => f.family === family)
      .map((f) => ({ date: f.date, predicted_sales: f.predicted_sales }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [forecasts, family]);
}

/** Get unique sorted family names */
export function useFamilyNames(inventory: InventoryRecommendation[]): string[] {
  return useMemo(() => {
    return inventory
      .sort((a, b) => a.demand_rank - b.demand_rank)
      .map((r) => r.family);
  }, [inventory]);
}

/** Compute XGBoost improvement over best baseline */
export function useModelImprovement(models: ModelComparison[]): {
  bestBaseline: ModelComparison | null;
  xgboost: ModelComparison | null;
  maeImprovement: number;
} {
  return useMemo(() => {
    const xgboost = models.find((m) => m.Model.includes('XGBoost')) || null;
    const baselines = models.filter((m) => !m.Model.includes('XGBoost'));
    const bestBaseline = baselines.length > 0
      ? baselines.reduce((best, m) => (m.MAE < best.MAE ? m : best))
      : null;

    const maeImprovement = xgboost && bestBaseline
      ? ((bestBaseline.MAE - xgboost.MAE) / bestBaseline.MAE) * 100
      : 0;

    return { bestBaseline, xgboost, maeImprovement };
  }, [models]);
}
