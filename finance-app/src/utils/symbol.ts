const SYMBOL_PATTERN = /^[A-Z][A-Z0-9.-]{0,9}$/;

export function normalizeSymbol(input: string): string {
  return input.trim().toUpperCase();
}

/** Returns a user-facing message when the symbol is malformed, otherwise null. */
export function validateSymbol(input: string): string | null {
  const symbol = normalizeSymbol(input);
  if (symbol === '') return 'Enter a ticker symbol, for example AAPL.';
  if (!SYMBOL_PATTERN.test(symbol)) {
    return 'Symbols start with a letter and may contain letters, digits, "." or "-" (max 10 characters).';
  }
  return null;
}
