import type { PricePoint, Quote, TimeWindow } from '../../types/market';

/**
 * Contract every finance data source must satisfy.
 * The UI depends only on this interface, so the mock source can be swapped
 * for a Yahoo Finance implementation without touching components or hooks.
 */
export interface MarketDataProvider {
  getQuotes(symbols: string[]): Promise<Quote[]>;
  getHistory(symbol: string, window: TimeWindow): Promise<PricePoint[]>;
}
