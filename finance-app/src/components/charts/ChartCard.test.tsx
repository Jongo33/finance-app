import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChartCard } from './ChartCard';

describe('ChartCard', () => {
  it('shows a loading state', () => {
    render(
      <ChartCard title="T" isLoading>
        <p>content</p>
      </ChartCard>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('shows an error with a working retry', async () => {
    const onRetry = vi.fn();
    render(
      <ChartCard title="T" error={new Error('boom')} onRetry={onRetry}>
        <p>content</p>
      </ChartCard>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('boom');
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders children when ready', () => {
    render(
      <ChartCard title="T" subtitle="sub">
        <p>content</p>
      </ChartCard>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.getByText('sub')).toBeInTheDocument();
  });
});
