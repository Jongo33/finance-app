import type { HistoryBySymbol, PricePoint } from '../types/market';

/** Percentage change of each point relative to the first point of the series. */
export function rebaseToPercent(points: PricePoint[]): PricePoint[] {
  if (points.length === 0) return [];
  const first = points[0].close;
  if (first === 0) return [];
  return points.map((p) => ({ t: p.t, close: ((p.close - first) / first) * 100 }));
}

/** Percentage change between first and last point; null when not computable. */
export function periodChangePercent(points: PricePoint[]): number | null {
  if (points.length < 2 || points[0].close === 0) return null;
  const first = points[0].close;
  const last = points[points.length - 1].close;
  return ((last - first) / first) * 100;
}

/** Drop rows with missing or non-finite values (Yahoo can return partial data). */
export function cleanPoints(points: Array<Partial<PricePoint>>): PricePoint[] {
  return points.filter(
    (p): p is PricePoint =>
      typeof p.t === 'number' && typeof p.close === 'number' && Number.isFinite(p.close),
  );
}

export interface ChartRow {
  t: number;
  [symbol: string]: number;
}

/** Merge per-symbol series into rows keyed by timestamp, as expected by multi-line charts. */
export function toChartRows(history: HistoryBySymbol): ChartRow[] {
  const rows = new Map<number, ChartRow>();
  for (const [symbol, points] of Object.entries(history)) {
    for (const p of points) {
      const row = rows.get(p.t) ?? { t: p.t };
      row[symbol] = p.close;
      rows.set(p.t, row);
    }
  }
  return [...rows.values()].sort((a, b) => a.t - b.t);
}
