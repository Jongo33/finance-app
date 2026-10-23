import { useQuery } from '@tanstack/react-query';
import { fetchQuotes } from '../services/marketService';

export function useQuotes(symbols: string[]) {
  return useQuery({
    queryKey: ['quotes', symbols],
    queryFn: () => fetchQuotes(symbols),
    staleTime: 60_000,
  });
}
