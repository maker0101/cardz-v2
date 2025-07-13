export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface ChartSeriesConfig {
  label: string;
  color: string;
}

export interface ChartConfig {
  [key: string]: ChartSeriesConfig;
}
