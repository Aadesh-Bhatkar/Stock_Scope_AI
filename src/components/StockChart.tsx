import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TimeRange, HistoricalDataPoint, Currency } from '../types/stock';
import { formatCurrency, formatVolume } from '../utils/formatters';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

interface StockChartProps {
  symbol: string;
  currency: Currency;
  points: HistoricalDataPoint[];
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  isLoading?: boolean;
  dataSource?: string;
}

export const StockChart: React.FC<StockChartProps> = ({
  symbol,
  currency,
  points,
  selectedRange,
  onRangeChange,
  isLoading = false,
  dataSource = 'Historical Daily Series',
}) => {
  const [showVolume, setShowVolume] = useState(true);

  const ranges: TimeRange[] = ['1M', '3M', '6M', '1Y', '5Y'];

  // Calculate range statistics
  const prices = points.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const firstPrice = prices.length ? prices[0] : 0;
  const lastPrice = prices.length ? prices[prices.length - 1] : 0;
  const rangeChange = lastPrice - firstPrice;
  const rangeChangePercent = firstPrice > 0 ? (rangeChange / firstPrice) * 100 : 0;
  const isRangePositive = rangeChange >= 0;

  // Formatting date for X-Axis
  const formatXAxisDate = (tickStr: string) => {
    if (!tickStr) return '';
    try {
      const parts = tickStr.split('-');
      if (parts.length === 3) {
        if (selectedRange === '5Y' || selectedRange === '1Y') {
          return `${parts[1]}/${parts[0].slice(2)}`;
        }
        return `${parts[1]}/${parts[2]}`;
      }
      return tickStr;
    } catch {
      return tickStr;
    }
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as HistoricalDataPoint;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md">
          <div className="font-mono text-xs font-semibold text-slate-300">
            {data.date}
          </div>
          <div className="mt-1 font-mono text-base font-bold text-white">
            {formatCurrency(data.price, currency)}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <div>
              Open: <span className="font-mono text-slate-200">{formatCurrency(data.open, currency)}</span>
            </div>
            <div>
              High: <span className="font-mono text-slate-200">{formatCurrency(data.high, currency)}</span>
            </div>
            <div>
              Low: <span className="font-mono text-slate-200">{formatCurrency(data.low, currency)}</span>
            </div>
            <div>
              Volume: <span className="font-mono text-slate-200">{formatVolume(data.volume)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">
              Historical Price Movement
            </h3>
            <span className="font-mono text-xs text-slate-400">
              ({symbol})
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span
              className={`font-mono font-semibold tabular-nums ${
                isRangePositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isRangePositive ? '+' : ''}
              {formatCurrency(rangeChange, currency)} ({isRangePositive ? '+' : ''}
              {rangeChangePercent.toFixed(2)}%)
            </span>
            <span className="text-slate-400">over {selectedRange}</span>
          </div>
        </div>

        {/* Range Selector and Volume Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Range tabs */}
          <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-slate-800">
            {ranges.map((r) => {
              const active = selectedRange === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRangeChange(r)}
                  disabled={isLoading}
                  className={`rounded-md px-3 py-1 font-mono text-xs font-semibold transition ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          {/* Volume toggle */}
          <button
            type="button"
            onClick={() => setShowVolume(!showVolume)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              showVolume
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Volume</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Price Area Chart */}
      <div className="relative h-72 w-full">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
            <span className="font-mono text-xs text-slate-400">Loading chart data...</span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isRangePositive ? '#10B981' : '#F43F5E'}
                  stopOpacity={0.28}
                />
                <stop
                  offset="95%"
                  stopColor={isRangePositive ? '#10B981' : '#F43F5E'}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatXAxisDate}
              minTickGap={28}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              domain={[minPrice * 0.98, maxPrice * 1.02]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v, currency, 0)}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isRangePositive ? '#10B981' : '#F43F5E'}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Optional Trading Volume Chart */}
      {showVolume && (
        <div className="pt-2 border-t border-slate-800/80">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Trading Volume by Session</span>
            <span className="font-mono text-[11px]">Shares</span>
          </div>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={points} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" hide={true} />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatVolume(v)}
                  orientation="right"
                />
                <Bar
                  dataKey="volume"
                  fill="#334155"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Range Min/Max Footnote & Data Source */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-3 font-mono">
          <span>Range Low: <strong className="text-slate-300">{formatCurrency(minPrice, currency)}</strong></span>
          <span>·</span>
          <span>Range High: <strong className="text-slate-300">{formatCurrency(maxPrice, currency)}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Info className="h-3 w-3" />
          <span>{dataSource} · Range: {selectedRange}</span>
        </div>
      </div>
    </div>
  );
};
