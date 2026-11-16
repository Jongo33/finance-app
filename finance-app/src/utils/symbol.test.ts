import { describe, expect, it } from 'vitest';
import { normalizeSymbol, validateSymbol } from './symbol';

describe('symbol utils', () => {
  it('trims and uppercases', () => {
    expect(normalizeSymbol('  aapl ')).toBe('AAPL');
  });

  it('accepts valid tickers', () => {
    for (const s of ['AAPL', 'brk-b', 'BF.B', 'x']) expect(validateSymbol(s)).toBeNull();
  });

  it('rejects empty, malformed and over-long input', () => {
    expect(validateSymbol('   ')).toMatch(/Enter a ticker/);
    expect(validateSymbol('1ABC')).not.toBeNull();
    expect(validateSymbol('AA PL')).not.toBeNull();
    expect(validateSymbol('A$')).not.toBeNull();
    expect(validateSymbol('ABCDEFGHIJK')).not.toBeNull();
  });
});
