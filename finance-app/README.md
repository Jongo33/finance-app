# Finance App — Market Dashboard

React + TypeScript + Vite dashboard comparing IBM with four competitors across three time windows (current day, last 7 days, last quarter).

## Commands

```bash
npm install
npm run dev        # start the app
npm run lint
npm run typecheck
npm test
npm run build
```

## Layout

```
src/
├─ config/        companies.ts — watchlist (max 5) and time windows
├─ types/         shared domain types
├─ services/
│  ├─ providers/  MarketDataProvider interface + MockProvider (Yahoo provider plugs in here)
│  ├─ marketService.ts   the only entry point the UI/hooks use
│  └─ normalize.ts       pure data transforms (rebase, clean, merge)
├─ hooks/         useQuotes, useHistory (TanStack Query)
├─ components/
│  ├─ charts/     ChartCard (loading/error frame), PriceLineChart
│  ├─ dashboard/  CompanySummaryCard, WindowTabs
│  ├─ common/     LoadingState, ErrorState
│  └─ layout/     AppShell
├─ pages/         Dashboard
└─ test/          test setup
```

Dependency direction: `pages → components/hooks → services → providers`. Components never fetch data directly.

## Data source

The app currently uses `MockProvider` (deterministic, offline). To use Yahoo Finance, implement `MarketDataProvider` (typically behind a small backend proxy, since `yahoo-finance2` is a Node library) and register it with `setMarketDataProvider`.

## Extending

- New company: add a row in `src/config/companies.ts`.
- New window: extend `TimeWindow`, `TIME_WINDOWS`, and the provider.
- New chart: wrap it in `ChartCard`.
