// === Data types matching actual CSV schemas ===

export interface FutureForecast {
  date: string;
  family: string;
  predicted_sales: number;
}

export interface FamilyForecastSummary {
  family: string;
  total_forecasted_demand_16_days: number;
  average_daily_forecast: number;
  maximum_daily_forecast: number;
}

export interface InventoryRecommendation {
  family: string;
  forecast_demand_16d: number;
  validation_error_std: number;
  safety_stock: number;
  recommended_stock: number;
  risk_ratio: number;
  risk_category: 'LOW' | 'MEDIUM' | 'HIGH';
  demand_rank: number;
}

export interface InventorySummary {
  total_forecast_demand: number;
  total_safety_stock: number;
  total_recommended_inventory: number;
  num_low_risk: number;
  num_medium_risk: number;
  num_high_risk: number;
}

export interface ModelComparison {
  Model: string;
  MAE: number;
  RMSE: number;
  'MAPE (%)': number;
}

// === Derived / UI types ===

export interface DailyAggregate {
  date: string;
  total_demand: number;
}

export interface FamilyDailyForecast {
  date: string;
  predicted_sales: number;
}

export type SortMode = 'demand-desc' | 'demand-asc' | 'safety-desc' | 'risk-desc';

export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH';
