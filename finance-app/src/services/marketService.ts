import { MockProvider } from './providers/MockProvider';
import type { MarketDataProvider } from './providers/MarketDataProvider';
import { cleanPoints, rebaseToPercent } from './normalize';
import type { HistoryBySymbol, Quote, TimeWindow } from '../types/market';

/**
 * Single place where the active data source is chosen.
 * Step C replaces this with a Yahoo Finance backed provider (via an API proxy).
 */
let provider: MarketDataProvider = new MockProvider();

export function setMarketDataProvider(next: MarketDataProvider): void {
  provider = next;
}

export function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  return provider.getQuotes(symbols);
}

/** Fetch history for every symbol; each series is cleaned and rebased to % change. */
export async function fetchHistory(
  symbols: string[],
  window: TimeWindow,
): Promise<HistoryBySymbol> {
  const entries = await Promise.all(
    symbols.map(async (symbol) => {
      const raw = await provider.getHistory(symbol, window);
      return [symbol, rebaseToPercent(cleanPoints(raw))] as const;
    }),
  );
  return Object.fromEntries(entries);
}
