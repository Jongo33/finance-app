import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SymbolPicker } from './SymbolPicker';

describe('SymbolPicker', () => {
  it('shows a message and does not select on invalid input', async () => {
    const onSelect = vi.fn();
    render(<SymbolPicker onSelect={onSelect} />);
    await userEvent.type(screen.getByLabelText('Add a company graph'), '1@@');
    await userEvent.click(screen.getByRole('button', { name: 'Show graph' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('shows a message on empty input', async () => {
    const onSelect = vi.fn();
    render(<SymbolPicker onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: 'Show graph' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/Enter a ticker/);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('selects the normalized symbol on valid input', async () => {
    const onSelect = vi.fn();
    render(<SymbolPicker onSelect={onSelect} />);
    await userEvent.type(screen.getByLabelText('Add a company graph'), ' aapl ');
    await userEvent.click(screen.getByRole('button', { name: 'Show graph' }));
    expect(onSelect).toHaveBeenCalledWith('AAPL');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
