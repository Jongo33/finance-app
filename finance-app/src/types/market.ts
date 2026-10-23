export type TimeWindow = '1D' | '7D' | '1Q';

export interface Company {
  symbol: string;
  name: string;
  color: string;
}

export interface Quote {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
}

export interface PricePoint {
  /** Epoch milliseconds */
  t: number;
  close: number;
}

export type HistoryBySymbol = Record<string, PricePoint[]>;
