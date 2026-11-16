import { describe, expect, it } from 'vitest';
import { NoDataError } from './errors';
import { MockProvider } from './providers/MockProvider';
import { fetchHistory, fetchQuotes, setMarketDataProvider } from './marketService';

describe('marketService with MockProvider', () => {
  setMarketDataProvider(new MockProvider(() => 1_700_000_000_000));

  it('returns a quote per requested symbol', async () => {
    const quotes = await fetchQuotes(['IBM', 'MSFT']);
    expect(quotes.map((q) => q.symbol)).toEqual(['IBM', 'MSFT']);
    expect(quotes[0].price).toBeGreaterThan(0);
  });

  it('returns rebased history starting at 0% for every window', async () => {
    for (const window of ['1D', '7D', '1Q'] as const) {
      const history = await fetchHistory(['IBM', 'ORCL'], window);
      expect(Object.keys(history)).toEqual(['IBM', 'ORCL']);
      expect(history.IBM[0].close).toBe(0);
      expect(history.IBM.length).toBeGreaterThan(1);
    }
  });

  it('rejects unknown symbols with NoDataError', async () => {
    await expect(fetchHistory(['NOPE'], '1D')).rejects.toBeInstanceOf(NoDataError);
  });

  it('rejects a symbol whose series is empty instead of returning other data', async () => {
    setMarketDataProvider({
      getQuotes: async () => [],
      getHistory: async () => [{ t: 1 }, { close: 2 }] as never,
    });
    try {
      await expect(fetchHistory(['EMPTY'], '1D')).rejects.toThrow('No data available for EMPTY.');
    } finally {
      setMarketDataProvider(new MockProvider(() => 1_700_000_000_000));
    }
  });
});
