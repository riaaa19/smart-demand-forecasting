import Papa from 'papaparse';
import type {
  FutureForecast,
  FamilyForecastSummary,
  InventoryRecommendation,
  InventorySummary,
  ModelComparison,
} from '@/types';

async function fetchCSV<T>(path: string): Promise<T[]> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const text = await res.text();

  return new Promise((resolve, reject) => {
    Papa.parse<T>(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn(`CSV parse warnings for ${path}:`, results.errors);
        }
        resolve(results.data);
      },
      error: (err: Error) => reject(err),
    });
  });
}

export async function loadFutureForecasts(): Promise<FutureForecast[]> {
  return fetchCSV<FutureForecast>('/data/future_demand_forecast.csv');
}

export async function loadFamilySummary(): Promise<FamilyForecastSummary[]> {
  return fetchCSV<FamilyForecastSummary>('/data/family_forecast_summary.csv');
}

export async function loadInventoryRecommendations(): Promise<InventoryRecommendation[]> {
  return fetchCSV<InventoryRecommendation>('/data/inventory_recommendations.csv');
}

export async function loadInventorySummary(): Promise<InventorySummary> {
  const rows = await fetchCSV<InventorySummary>('/data/inventory_summary.csv');
  if (rows.length === 0) throw new Error('inventory_summary.csv is empty');
  return rows[0];
}

export async function loadModelComparison(): Promise<ModelComparison[]> {
  return fetchCSV<ModelComparison>('/data/model_comparison.csv');
}
