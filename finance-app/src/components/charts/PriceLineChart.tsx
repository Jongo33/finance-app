import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toChartRows } from '../../services/normalize';
import type { Company, HistoryBySymbol, TimeWindow } from '../../types/market';

interface PriceLineChartProps {
  companies: Company[];
  history: HistoryBySymbol;
  window: TimeWindow;
}

function formatTick(t: number, window: TimeWindow): string {
  const d = new Date(t);
  return window === '1D'
    ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Multi-line comparison chart of % change since the start of the window. */
export function PriceLineChart({ companies, history, window }: PriceLineChartProps) {
  const rows = toChartRows(history);

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" tickFormatter={(t: number) => formatTick(t, window)} minTickGap={32} />
          <YAxis tickFormatter={(v: number) => `${v.toFixed(1)}%`} />
          <Tooltip
            labelFormatter={(t: number) => formatTick(t, window)}
            formatter={(v: number) => `${v.toFixed(2)}%`}
          />
          <Legend />
          {companies.map((c) => (
            <Line
              key={c.symbol}
              type="monotone"
              dataKey={c.symbol}
              name={c.name}
              stroke={c.color}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
