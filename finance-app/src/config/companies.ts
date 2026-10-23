import type { Company, TimeWindow } from '../types/market';

/** Maximum number of companies tracked at once: IBM plus four competitors. */
export const MAX_COMPANIES = 5;

export const COMPANIES: Company[] = [
  { symbol: 'IBM', name: 'IBM', color: '#0f62fe' },
  { symbol: 'MSFT', name: 'Microsoft', color: '#198038' },
  { symbol: 'ORCL', name: 'Oracle', color: '#da1e28' },
  { symbol: 'SAP', name: 'SAP', color: '#8a3ffc' },
  { symbol: 'CRM', name: 'Salesforce', color: '#b28600' },
].slice(0, MAX_COMPANIES);

export const TIME_WINDOWS: { id: TimeWindow; label: string }[] = [
  { id: '1D', label: 'Current day' },
  { id: '7D', label: 'Last 7 days' },
  { id: '1Q', label: 'Last quarter' },
];
