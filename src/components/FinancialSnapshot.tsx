import React from 'react';
import { StockQuote } from '../types/stock';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Coins,
  Scale,
  Award,
  Calendar,
  FileText,
  Info,
} from 'lucide-react';

interface FinancialSnapshotProps {
  stock: StockQuote;
}

export const FinancialSnapshot: React.FC<FinancialSnapshotProps> = ({ stock }) => {
  const { financials } = stock;

  const metrics = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: financials.revenue || 'Not available',
      explanation: 'The total amount of money brought in through sales of products or services before any expenses are subtracted.',
      icon: DollarSign,
      category: 'Top-Line Scale',
    },
    {
      id: 'netIncome',
      label: 'Net Income (Profit)',
      value: financials.netIncome || 'Not available',
      explanation: 'The actual profit remaining after subtracting all operating expenses, taxes, interest, and costs from revenue.',
      icon: Coins,
      category: 'Bottom-Line Earnings',
    },
    {
      id: 'profitMargin',
      label: 'Net Profit Margin',
      value: financials.profitMargin || 'Not available',
      explanation: 'The percentage of revenue that remains as profit. For instance, 20% means the company keeps $0.20 of profit for every $1 made in sales.',
      icon: Percent,
      category: 'Efficiency',
    },
    {
      id: 'eps',
      label: 'Earnings Per Share (EPS)',
      value: financials.eps || 'Not available',
      explanation: "A company's total net profit divided by the total number of common shares outstanding.",
      icon: TrendingUp,
      category: 'Per-Share Profit',
    },
    {
      id: 'peRatio',
      label: 'P/E Ratio',
      value: financials.peRatio || 'Not available',
      explanation: "A measure comparing a company's share price with its earnings per share. High P/E often reflects high growth expectations.",
      icon: Scale,
      category: 'Valuation Multiple',
    },
    {
      id: 'debtToEquity',
      label: 'Debt-to-Equity Ratio',
      value: financials.debtToEquity || 'Not available',
      explanation: 'Compares total debt liabilities to shareholders’ equity. Measures financial leverage and how much debt is financing company operations.',
      icon: Scale,
      category: 'Financial Health',
    },
    {
      id: 'roe',
      label: 'Return on Equity (ROE)',
      value: financials.roe || 'Not available',
      explanation: 'Measures how efficiently management uses shareholders’ invested capital to generate net profits.',
      icon: Award,
      category: 'Capital Efficiency',
    },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Financial Snapshot
          </h3>
          <p className="text-xs text-slate-400">
            Fundamental accounting figures from official corporate reporting
          </p>
        </div>

        {/* Reporting Period & Date Pill/Badge */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-300">
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-medium">Period: {financials.reportingPeriod || 'Latest Filing'}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-mono text-slate-400">Filing Date: {financials.reportingDate || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Metrics Table / Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item) => {
          const Icon = item.icon;
          const isNotAvailable = item.value === 'Not available';
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition hover:border-slate-700 hover:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <div className="rounded p-1 text-slate-400">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-1 text-sm font-medium text-slate-300">
                  {item.label}
                </div>

                <div
                  className={`mt-2 font-mono text-xl font-bold tabular-nums ${
                    isNotAvailable ? 'text-slate-400 font-normal text-base' : 'text-white'
                  }`}
                >
                  {item.value}
                </div>
              </div>

              {/* Beginner-friendly explanation */}
              <div className="mt-3 border-t border-slate-800/80 pt-2.5 text-xs leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">{item.label}: </span>
                {item.explanation}
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Advisory */}
      <div className="flex items-start gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-xs text-slate-400">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        <p>
          Financial metrics are historical snapshots from past quarters. Companies across different industries (e.g., software vs. manufacturing) naturally have very different profit margins and debt structures. Never judge a company by a single number.
        </p>
      </div>
    </div>
  );
};
