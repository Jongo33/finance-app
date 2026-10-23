import type { PricePoint, Quote, TimeWindow } from '../../types/market';
import type { MarketDataProvider } from './MarketDataProvider';

const BASE_PRICE: Record<string, number> = {
  IBM: 185,
  MSFT: 420,
  ORCL: 125,
  SAP: 190,
  CRM: 270,
};

/** [number of points, step in ms] per window. */
const WINDOW_SHAPE: Record<TimeWindow, [number, number]> = {
  '1D': [78, 5 * 60 * 1000],
  '7D': [7 * 8, 3 * 60 * 60 * 1000],
  '1Q': [90, 24 * 60 * 60 * 1000],
};

function seedFrom(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/** Deterministic pseudo-random generator so mock data is stable across renders and tests. */
function rng(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** Offline, deterministic data source used for development, tests and demos. */
export class MockProvider implements MarketDataProvider {
  constructor(private readonly now: () => number = Date.now) {}

  async getQuotes(symbols: string[]): Promise<Quote[]> {
    return symbols.map((symbol) => {
      const series = this.series(symbol, '1D');
      const price = series[series.length - 1].close;
      const previousClose = series[0].close;
      const change = price - previousClose;
      return {
        symbol,
        price,
        previousClose,
        change,
        changePercent: (change / previousClose) * 100,
      };
    });
  }

  async getHistory(symbol: string, window: TimeWindow): Promise<PricePoint[]> {
    return this.series(symbol, window);
  }

  private series(symbol: string, window: TimeWindow): PricePoint[] {
    const base = BASE_PRICE[symbol];
    if (base === undefined) throw new Error(`Unknown symbol: ${symbol}`);
    const [count, step] = WINDOW_SHAPE[window];
    const rand = rng(seedFrom(`${symbol}:${window}`));
    const end = this.now();
    let price = base;
    const points: PricePoint[] = [];
    for (let i = 0; i < count; i++) {
      price = Math.max(1, price * (1 + (rand() - 0.5) * 0.01));
      points.push({ t: end - (count - 1 - i) * step, close: Number(price.toFixed(2)) });
    }
    return points;
  }
}
