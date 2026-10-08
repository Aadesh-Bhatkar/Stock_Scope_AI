import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { StockQuote } from '../types/stock';
import { formatCurrency, formatChange, formatPercent, formatVolume, formatTimestamp } from '../utils/formatters';

interface MetricCardsProps {
  stock: StockQuote;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stock }) => {
  const isPositive = stock.change >= 0;

  const metrics = [
    {
      id: 'price',
      label: 'Latest Available Price',
      value: formatCurrency(stock.currentPrice, stock.currency),
      change: `${formatChange(stock.change, stock.currency)} (${formatPercent(stock.changePercent)})`,
      isChangePositive: isPositive,
      icon: DollarSign,
      explanation: 'The most recent market closing or traded price per share.',
    },
    {
      id: 'marketCap',
      label: 'Market Capitalization',
      value: stock.marketCap || 'Not available',
      subtext: `${stock.currency} Valuation`,
      icon: Layers,
      explanation: 'Total dollar value of all company shares (Share Price × Total Outstanding Shares).',
    },
    {
      id: 'highLow52',
      label: '52-Week Range',
      value: `${formatCurrency(stock.low52, stock.currency)} – ${formatCurrency(stock.high52, stock.currency)}`,
      subtext: 'Lowest and highest prices over 1 year',
      icon: BarChart2,
      explanation: 'Shows the lowest and highest price the stock reached over the past 52 weeks (1 year).',
    },
    {
      id: 'peRatio',
      label: 'P/E Ratio (Price / Earnings)',
      value: stock.peRatio || 'Not available',
      subtext: stock.peRatio ? 'Valuation Multiple' : 'No earnings data',
      icon: PieChart,
      explanation: 'Compares the stock price to the earnings per share. Tells you how much investors pay per $1 of profit.',
    },
    {
      id: 'volume',
      label: 'Trading Volume',
      value: formatVolume(stock.volume),
      subtext: `Avg: ${formatVolume(stock.avgVolume)}`,
      icon: TrendingUp,
      explanation: 'Total number of shares bought and sold during the most recent trading session.',
    },
    {
      id: 'prevClose',
      label: 'Previous Close & Open',
      value: `${formatCurrency(stock.previousClose, stock.currency)} / ${formatCurrency(stock.openPrice, stock.currency)}`,
      subtext: 'Prev Close / Today Open',
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
      explanation: 'The final traded price yesterday compared to the opening price today.',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header Context Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">{stock.exchange}</span>
          <span>·</span>
          <span>Currency: <strong className="font-mono text-slate-200">{stock.currency} ({stock.currencySymbol})</strong></span>
          <span>·</span>
          <span className="text-slate-400">Sector: {stock.sector}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className={`inline-block h-2 w-2 rounded-full ${stock.isLive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
          <span>Data: {stock.dataSource}</span>
          <span>·</span>
          <span>Updated: {formatTimestamp(stock.lastUpdated)}</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium text-slate-300">{m.label}</span>
                <div className="flex items-center gap-1.5">
                  <div
                    title={m.explanation}
                    className="cursor-help text-slate-400 transition hover:text-slate-200"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-md bg-slate-800 p-1.5 text-slate-300">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="font-mono text-xl font-bold tracking-tight text-white tabular-nums sm:text-2xl">
                  {m.value}
                </div>

                {m.change ? (
                  <div
                    className={`mt-1 flex items-center gap-1 font-mono text-xs font-semibold tabular-nums ${
                      m.isChangePositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {m.isChangePositive ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    <span>{m.change}</span>
                  </div>
                ) : m.subtext ? (
                  <div className="mt-1 text-xs text-slate-400">{m.subtext}</div>
                ) : null}
              </div>

              {/* Quiet Educational Sub-footnote */}
              <div className="mt-2 border-t border-slate-800/80 pt-2 text-[11px] leading-tight text-slate-400">
                {m.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
