import { formatPercent, formatPrice } from '../../utils/format';
import type { Company, Quote } from '../../types/market';

interface CompanySummaryCardProps {
  company: Company;
  quote?: Quote;
}

export function CompanySummaryCard({ company, quote }: CompanySummaryCardProps) {
  const direction = !quote ? 'flat' : quote.change >= 0 ? 'up' : 'down';
  return (
    <article className={`card summary-card summary-card--${direction}`} aria-label={company.name}>
      <h3 style={{ color: company.color }}>
        {company.name} <span className="muted">({company.symbol})</span>
      </h3>
      {quote ? (
        <>
          <p className="price">{formatPrice(quote.price)}</p>
          <p className="change">{formatPercent(quote.changePercent)}</p>
        </>
      ) : (
        <p className="muted">No data</p>
      )}
    </article>
  );
}
