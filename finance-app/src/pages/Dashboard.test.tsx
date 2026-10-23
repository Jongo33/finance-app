import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
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
});
