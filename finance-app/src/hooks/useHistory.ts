import { useQuery } from '@tanstack/react-query';
import { NoDataError } from '../services/errors';
import { fetchHistory } from '../services/marketService';
import type { TimeWindow } from '../types/market';

export function useHistory(symbols: string[], window: TimeWindow) {
  return useQuery({
    queryKey: ['history', window, symbols],
    queryFn: () => fetchHistory(symbols, window),
    staleTime: window === '1D' ? 60_000 : 15 * 60_000,
    // A symbol with no data will not gain data on retry.
    retry: (failureCount, error) => !(error instanceof NoDataError) && failureCount < 2,
  });
}
