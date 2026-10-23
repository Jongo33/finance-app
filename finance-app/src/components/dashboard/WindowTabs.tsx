import { TIME_WINDOWS } from '../../config/companies';
import type { TimeWindow } from '../../types/market';

interface WindowTabsProps {
  value: TimeWindow;
  onChange: (next: TimeWindow) => void;
}

export function WindowTabs({ value, onChange }: WindowTabsProps) {
  return (
    <div role="tablist" aria-label="Time window" className="tabs">
      {TIME_WINDOWS.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          type="button"
          aria-selected={value === id}
          className={value === id ? 'tab tab--active' : 'tab'}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
