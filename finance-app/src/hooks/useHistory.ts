import { useQuery } from '@tanstack/react-query';
import { fetchHistory } from '../services/marketService';
import type { TimeWindow } from '../types/market';

export function useHistory(symbols: string[], window: TimeWindow) {
  return useQuery({
    queryKey: ['history', window, symbols],
    queryFn: () => fetchHistory(symbols, window),
    staleTime: window === '1D' ? 60_000 : 15 * 60_000,
  });
}
