/** Raised when a symbol has no usable market data (unknown ticker or empty series). */
export class NoDataError extends Error {
  readonly symbol: string;

  constructor(symbol: string) {
    super(`No data available for ${symbol}.`);
    this.name = 'NoDataError';
    this.symbol = symbol;
  }
}
