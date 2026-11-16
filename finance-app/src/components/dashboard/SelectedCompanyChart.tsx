import { useHistory } from '../../hooks/useHistory';
import { NoDataError } from '../../services/errors';
import type { Company, TimeWindow } from '../../types/market';
import { ChartCard } from '../charts/ChartCard';
import { PriceLineChart } from '../charts/PriceLineChart';

interface SelectedCompanyChartProps {
  symbol: string;
  window: TimeWindow;
}

/** Graph for one user-selected company. Plots only that symbol, never a substitute. */
export function SelectedCompanyChart({ symbol, window }: SelectedCompanyChartProps) {
  const history = useHistory([symbol], window);
  const company: Company = { symbol, name: symbol, color: '#0043ce' };
  const noData = history.error instanceof NoDataError;

  return (
    <ChartCard
      title={`${symbol}: % change`}
      subtitle="Selected company, relative performance since the start of the window"
      isLoading={history.isLoading}
      error={history.error}
      onRetry={noData ? undefined : () => void history.refetch()}
    >
      <PriceLineChart companies={[company]} history={history.data ?? {}} window={window} />
    </ChartCard>
  );
}
