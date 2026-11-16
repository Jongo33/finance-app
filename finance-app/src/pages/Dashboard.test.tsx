import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { COMPANIES } from '../config/companies';
import { Dashboard } from './Dashboard';

function renderDashboard() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <Dashboard />
    </QueryClientProvider>,
  );
}

describe('Dashboard', () => {
  it('renders a summary card per company and the three window tabs', async () => {
    renderDashboard();
    for (const c of COMPANIES) {
      expect(await screen.findByRole('article', { name: c.name })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('switches the active window', async () => {
    renderDashboard();
    const tab = screen.getByRole('tab', { name: 'Last quarter' });
    await userEvent.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByRole('region', { name: /Last quarter/ })).toBeInTheDocument();
  });

  it('shows a graph for a user-selected company and keeps the existing dashboard', async () => {
    renderDashboard();
    await userEvent.type(screen.getByLabelText('Add a company graph'), 'aapl');
    await userEvent.click(screen.getByRole('button', { name: 'Show graph' }));

    expect(await screen.findByRole('region', { name: 'AAPL: % change' })).toBeInTheDocument();
    for (const c of COMPANIES) {
      expect(await screen.findByRole('article', { name: c.name })).toBeInTheDocument();
    }
    expect(screen.getByRole('region', { name: /Current day/ })).toBeInTheDocument();
  });

  it('shows a no-data message for an unsupported symbol without affecting the dashboard', async () => {
    renderDashboard();
    await userEvent.type(screen.getByLabelText('Add a company graph'), 'ZZZZ');
    await userEvent.click(screen.getByRole('button', { name: 'Show graph' }));

    const card = await screen.findByRole('region', { name: 'ZZZZ: % change' });
    expect(await within(card).findByRole('alert')).toHaveTextContent('No data available for ZZZZ.');
    expect(within(card).queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
    for (const c of COMPANIES) {
      expect(await screen.findByRole('article', { name: c.name })).toBeInTheDocument();
    }
    expect(screen.getByRole('region', { name: /Current day/ })).toBeInTheDocument();
  });

  it('keeps the selected company graph when the time window changes', async () => {
    renderDashboard();
    await userEvent.type(screen.getByLabelText('Add a company graph'), 'AAPL');
    await userEvent.click(screen.getByRole('button', { name: 'Show graph' }));
    await userEvent.click(screen.getByRole('tab', { name: 'Last 7 days' }));
    expect(await screen.findByRole('region', { name: 'AAPL: % change' })).toBeInTheDocument();
  });
});
