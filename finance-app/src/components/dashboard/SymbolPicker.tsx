import { useState, type FormEvent } from 'react';
import { normalizeSymbol, validateSymbol } from '../../utils/symbol';

interface SymbolPickerProps {
  onSelect: (symbol: string) => void;
}

/** Simple ticker input. Validates format locally; whether data exists is decided by the data layer. */
export function SymbolPicker({ onSelect }: SymbolPickerProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = validateSymbol(value);
    setError(message);
    if (message === null) onSelect(normalizeSymbol(value));
  }

  return (
    <form className="card symbol-picker" onSubmit={handleSubmit} noValidate>
      <label htmlFor="symbol-input">Add a company graph</label>
      <div className="symbol-picker__row">
        <input
          id="symbol-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ticker, e.g. AAPL"
          aria-invalid={error !== null}
          aria-describedby={error ? 'symbol-error' : undefined}
          autoComplete="off"
        />
        <button type="submit">Show graph</button>
      </div>
      {error && (
        <p id="symbol-error" role="alert" className="field-error">
          {error}
        </p>
      )}
    </form>
  );
}
