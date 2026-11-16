import { useState } from 'react';
import { ChartCard } from '../components/charts/ChartCard';
import { PriceLineChart } from '../components/charts/PriceLineChart';
import { CompanySummaryCard } from '../components/dashboard/CompanySummaryCard';
import { SelectedCompanyChart } from '../components/dashboard/SelectedCompanyChart';
import { SymbolPicker } from '../components/dashboard/SymbolPicker';
import { WindowTabs } from '../components/dashboard/WindowTabs';
import { COMPANIES, TIME_WINDOWS } from '../config/companies';
import { useHistory } from '../hooks/useHistory';
import { useQuotes } from '../hooks/useQuotes';
import type { TimeWindow } from '../types/market';

const SYMBOLS = COMPANIES.map((c) => c.symbol);

export function Dashboard() {
  const [window, setWindow] = useState<TimeWindow>('1D');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const quotes = useQuotes(SYMBOLS);
  const history = useHistory(SYMBOLS, window);
  const windowLabel = TIME_WINDOWS.find((w) => w.id === window)?.label ?? window;

  return (
    <>
      <WindowTabs value={window} onChange={setWindow} />

      <div className="summary-grid">
        {COMPANIES.map((company) => (
          <CompanySummaryCard
            key={company.symbol}
            company={company}
            quote={quotes.data?.find((q) => q.symbol === company.symbol)}
          />
        ))}
      </div>

      <ChartCard
        title={`${windowLabel}: % change`}
        subtitle="Relative performance since the start of the window"
        isLoading={history.isLoading}
        error={history.error}
        onRetry={() => void history.refetch()}
      >
        <PriceLineChart companies={COMPANIES} history={history.data ?? {}} window={window} />
      </ChartCard>

      <SymbolPicker onSelect={setSelectedSymbol} />
      {selectedSymbol && <SelectedCompanyChart symbol={selectedSymbol} window={window} />}
    </>
  );
}
