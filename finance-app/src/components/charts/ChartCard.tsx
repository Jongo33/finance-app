import type { ReactNode } from 'react';
import { ErrorState } from '../common/ErrorState';
import { LoadingState } from '../common/LoadingState';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: ReactNode;
}

/** Reusable frame for any chart: title plus loading / error / content states. */
export function ChartCard({
  title,
  subtitle,
  isLoading = false,
  error = null,
  onRetry,
  children,
}: ChartCardProps) {
  return (
    <section className="card chart-card" aria-label={title}>
      <header>
        <h2>{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}
      </header>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.message} onRetry={onRetry} />
      ) : (
        children
      )}
    </section>
  );
}
