import { describe, expect, it } from 'vitest';
import { cleanPoints, periodChangePercent, rebaseToPercent, toChartRows } from './normalize';

describe('normalize', () => {
  it('rebases a series to percent change from the first point', () => {
    const out = rebaseToPercent([
      { t: 1, close: 100 },
      { t: 2, close: 110 },
    ]);
    expect(out.map((p) => p.close)).toEqual([0, 10]);
  });

  it('returns an empty array for empty or zero-based series', () => {
    expect(rebaseToPercent([])).toEqual([]);
    expect(rebaseToPercent([{ t: 1, close: 0 }])).toEqual([]);
  });

  it('computes period change and handles short series', () => {
    expect(
      periodChangePercent([
        { t: 1, close: 50 },
        { t: 2, close: 45 },
      ]),
    ).toBeCloseTo(-10);
    expect(periodChangePercent([{ t: 1, close: 50 }])).toBeNull();
  });

  it('drops partial or non-finite rows', () => {
    const out = cleanPoints([
      { t: 1, close: 10 },
      { t: 2 },
      { t: 3, close: Number.NaN },
      { close: 5 },
    ]);
    expect(out).toEqual([{ t: 1, close: 10 }]);
  });

  it('merges per-symbol series into rows by timestamp', () => {
    const rows = toChartRows({
      IBM: [{ t: 2, close: 1 }],
      MSFT: [
        { t: 1, close: 5 },
        { t: 2, close: 6 },
      ],
    });
    expect(rows).toEqual([
      { t: 1, MSFT: 5 },
      { t: 2, IBM: 1, MSFT: 6 },
    ]);
  });
});
