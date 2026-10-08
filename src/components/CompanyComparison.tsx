import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { StockQuote } from '../types/stock';
import { compareCompanies } from '../services/stockApi';
import { GitCompare, AlertTriangle, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface CompanyComparisonProps {
  initialSymbolA?: string;
  initialSymbolB?: string;
  onSelectCompany?: (symbol: string) => void;
}

const AVAILABLE_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'AMZN', name: 'Amazon.com' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
];

const PRESETS = [
  { a: 'AAPL', b: 'MSFT', label: 'Apple vs Microsoft' },
  { a: 'NVDA', b: 'AMD', label: 'NVIDIA vs AMD' },
  { a: 'GOOGL', b: 'META', label: 'Alphabet vs Meta' },
  { a: 'RELIANCE.NS', b: 'TCS.NS', label: 'Reliance vs TCS' },
];

type CompareMetricKey = 'marketCap' | 'revenue' | 'netIncome' | 'peRatio' | 'profitMargin';

export const CompanyComparison: React.FC<CompanyComparisonProps> = ({
  initialSymbolA = 'AAPL',
  initialSymbolB = 'MSFT',
  onSelectCompany,
}) => {
  const [symbolA, setSymbolA] = useState(initialSymbolA);
  const [symbolB, setSymbolB] = useState(initialSymbolB);
  const [companyA, setCompanyA] = useState<StockQuote | null>(null);
  const [companyB, setCompanyB] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChartMetric, setSelectedChartMetric] = useState<CompareMetricKey>('revenue');

  // Load comparison data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await compareCompanies(symbolA, symbolB);
        if (isMounted) {
          setCompanyA(data.companyA);
          setCompanyB(data.companyB);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to compare the selected companies.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [symbolA, symbolB]);

  // Chart dataset preparation
  const getChartData = () => {
    if (!companyA || !companyB) return [];

    let valA = 0;
    let valB = 0;
    let unitLabel = '';

    if (selectedChartMetric === 'marketCap') {
      // In Billions
      valA = companyA.marketCapRaw / 1e9;
      valB = companyB.marketCapRaw / 1e9;
      unitLabel = `${companyA.currency === 'INR' ? '₹' : '$'} Billions`;
    } else if (selectedChartMetric === 'revenue') {
      valA = companyA.financials.revenueRaw / 1e9;
      valB = companyB.financials.revenueRaw / 1e9;
      unitLabel = `${companyA.currency === 'INR' ? '₹' : '$'} Billions`;
    } else if (selectedChartMetric === 'netIncome') {
      valA = companyA.financials.netIncomeRaw / 1e9;
      valB = companyB.financials.netIncomeRaw / 1e9;
      unitLabel = `${companyA.currency === 'INR' ? '₹' : '$'} Billions`;
    } else if (selectedChartMetric === 'peRatio') {
      valA = companyA.peRatioRaw || 0;
      valB = companyB.peRatioRaw || 0;
      unitLabel = 'Multiple';
    } else if (selectedChartMetric === 'profitMargin') {
      valA = companyA.financials.profitMarginRaw || 0;
      valB = companyB.financials.profitMarginRaw || 0;
      unitLabel = '% Margin';
    }

    return [
      {
        metric: selectedChartMetric,
        unitLabel,
        [companyA.symbol]: Number(valA.toFixed(2)),
        [companyB.symbol]: Number(valB.toFixed(2)),
      },
    ];
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6">
      {/* Header and Company Selectors */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Company Comparison</h2>
              <p className="text-xs text-slate-400">
                Analyze two companies side-by-side across fundamental and market metrics
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Quick Pairs:</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setSymbolA(p.a);
                  setSymbolB(p.b);
                }}
                className={`rounded-lg px-2.5 py-1 transition ${
                  symbolA === p.a && symbolB === p.b
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Company Dropdowns */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Company A:
            </label>
            <select
              value={symbolA}
              onChange={(e) => setSymbolA(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white outline-none focus:border-emerald-500"
            >
              {AVAILABLE_STOCKS.map((s) => (
                <option key={`a-${s.symbol}`} value={s.symbol} disabled={s.symbol === symbolB}>
                  {s.name} ({s.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Company B:
            </label>
            <select
              value={symbolB}
              onChange={(e) => setSymbolB(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white outline-none focus:border-emerald-500"
            >
              {AVAILABLE_STOCKS.map((s) => (
                <option key={`b-${s.symbol}`} value={s.symbol} disabled={s.symbol === symbolA}>
                  {s.name} ({s.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-12 text-center text-slate-400">
          Loading comparison data...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-6 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-rose-400 mb-2" />
          <p className="text-sm font-semibold text-rose-200">{error}</p>
        </div>
      ) : companyA && companyB ? (
        <>
          {/* Comparison Side-by-Side Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0F172A]">
            <div className="border-b border-slate-800 p-4">
              <h3 className="text-base font-semibold text-white">
                Detailed Metrics Comparison Table
              </h3>
              <p className="text-xs text-slate-400">
                Direct side-by-side fundamental accounting figures
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Metric</th>
                    <th className="px-5 py-3">
                      <div className="font-bold text-white text-sm">{companyA.name}</div>
                      <div className="font-mono text-emerald-400 text-xs">{companyA.symbol} ({companyA.currency})</div>
                    </th>
                    <th className="px-5 py-3">
                      <div className="font-bold text-white text-sm">{companyB.name}</div>
                      <div className="font-mono text-cyan-400 text-xs">{companyB.symbol} ({companyB.currency})</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-200">
                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      Share Price & Daily Move
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white">
                        {formatCurrency(companyA.currentPrice, companyA.currency)}
                      </div>
                      <span className={`text-xs flex items-center gap-0.5 ${companyA.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {companyA.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {formatPercent(companyA.changePercent)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white">
                        {formatCurrency(companyB.currentPrice, companyB.currency)}
                      </div>
                      <span className={`text-xs flex items-center gap-0.5 ${companyB.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {companyB.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {formatPercent(companyB.changePercent)}
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      Market Capitalization
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">
                      {companyA.marketCap}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">
                      {companyB.marketCap}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      Total Revenue (Top Line)
                    </td>
                    <td className="px-5 py-3.5">
                      {companyA.financials.revenue}
                    </td>
                    <td className="px-5 py-3.5">
                      {companyB.financials.revenue}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      Net Income (Profit)
                    </td>
                    <td className="px-5 py-3.5">
                      {companyA.financials.netIncome}
                    </td>
                    <td className="px-5 py-3.5">
                      {companyB.financials.netIncome}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      Net Profit Margin
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-400">
                      {companyA.financials.profitMargin}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-cyan-400">
                      {companyB.financials.profitMargin}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      P/E Ratio
                    </td>
                    <td className="px-5 py-3.5">
                      {companyA.peRatio || 'N/A'}
                    </td>
                    <td className="px-5 py-3.5">
                      {companyB.peRatio || 'N/A'}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      Debt-to-Equity Ratio
                    </td>
                    <td className="px-5 py-3.5">
                      {companyA.financials.debtToEquity || 'N/A'}
                    </td>
                    <td className="px-5 py-3.5">
                      {companyB.financials.debtToEquity || 'N/A'}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      Return on Equity (ROE)
                    </td>
                    <td className="px-5 py-3.5">
                      {companyA.financials.roe || 'N/A'}
                    </td>
                    <td className="px-5 py-3.5">
                      {companyB.financials.roe || 'N/A'}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400 text-xs">
                      Filing Period & Date
                    </td>
                    <td className="px-5 py-3.5 font-sans text-xs text-slate-400">
                      {companyA.financials.reportingPeriod} ({companyA.financials.reportingDate})
                    </td>
                    <td className="px-5 py-3.5 font-sans text-xs text-slate-400">
                      {companyB.financials.reportingPeriod} ({companyB.financials.reportingDate})
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Metric Comparison Bar Chart */}
          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Visual Metric Comparison
                </h3>
                <p className="text-xs text-slate-400">
                  Select which financial indicator to visualize on the bar chart
                </p>
              </div>

              {/* Metric Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
                {(
                  [
                    { key: 'revenue', label: 'Revenue' },
                    { key: 'netIncome', label: 'Net Income' },
                    { key: 'marketCap', label: 'Market Cap' },
                    { key: 'peRatio', label: 'P/E Ratio' },
                    { key: 'profitMargin', label: 'Profit Margin' },
                  ] as Array<{ key: CompareMetricKey; label: string }>
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedChartMetric(tab.key)}
                    className={`rounded-md px-3 py-1 font-medium transition ${
                      selectedChartMetric === tab.key
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="metric" tick={false} stroke="#64748B" />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl">
                            <div className="font-semibold text-slate-300 capitalize mb-1">
                              {selectedChartMetric}
                            </div>
                            {payload.map((entry: any) => (
                              <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
                                <span style={{ color: entry.color }} className="font-bold">
                                  {entry.name}:
                                </span>
                                <span className="font-mono text-white font-semibold">
                                  {entry.value} {chartData[0]?.unitLabel}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey={companyA.symbol}
                    name={`${companyA.name} (${companyA.symbol})`}
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar
                    dataKey={companyB.symbol}
                    name={`${companyB.name} (${companyB.symbol})`}
                    fill="#06B6D4"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Educational Comparison Guidance */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div className="space-y-1 text-xs leading-relaxed text-slate-300">
                <p className="font-semibold text-white">
                  Important Educational Comparison Note:
                </p>
                <p>
                  Different currencies (e.g., USD vs INR), reporting periods (calendar vs fiscal years), business models, and geographic markets heavily influence comparative financial metrics.
                </p>
                <p className="text-slate-400">
                  A lower P/E ratio does not automatically indicate an undervalued stock, nor does higher revenue mean superior financial strength. Context such as capital intensity, debt burden, and growth reinvestment must always be evaluated holistically.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
