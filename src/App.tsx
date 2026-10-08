import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { StockSearch } from './components/StockSearch';
import { MetricCards } from './components/MetricCards';
import { StockChart } from './components/StockChart';
import { FinancialSnapshot } from './components/FinancialSnapshot';
import { CompanyComparison } from './components/CompanyComparison';
import { AIStockAnalyst } from './components/AIStockAnalyst';
import { ResearchReport } from './components/ResearchReport';
import { Watchlist } from './components/Watchlist';
import { LearnBasics } from './components/LearnBasics';
import { AboutModal } from './components/AboutModal';

import { StockQuote, HistoricalDataPoint, TimeRange } from './types/stock';
import { getStockQuote, getStockHistory } from './services/stockApi';
import {
  Menu,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { formatTimestamp } from './utils/formatters';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentSymbol, setCurrentSymbol] = useState('AAPL');
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
  const [historicalPoints, setHistoricalPoints] = useState<HistoricalDataPoint[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1Y');
  
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(3);

  // Load stock quote
  const loadStockData = useCallback(async (symbol: string) => {
    setIsLoadingStock(true);
    setStockError(null);
    try {
      const quote = await getStockQuote(symbol);
      setStockQuote(quote);
      setCurrentSymbol(quote.symbol);
    } catch (err: any) {
      setStockError(err.message || `Unable to load data for "${symbol}".`);
    } finally {
      setIsLoadingStock(false);
    }
  }, []);

  // Load history data
  const loadHistoryData = useCallback(async (symbol: string, range: TimeRange) => {
    setIsLoadingHistory(true);
    try {
      const history = await getStockHistory(symbol, range);
      setHistoricalPoints(history.points);
    } catch (err: any) {
      console.warn('Failed to load history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadStockData(currentSymbol);
  }, [loadStockData, currentSymbol]);

  // Load history when symbol or range changes
  useEffect(() => {
    if (currentSymbol) {
      loadHistoryData(currentSymbol, selectedRange);
    }
  }, [loadHistoryData, currentSymbol, selectedRange]);

  const handleSelectStock = (newSymbol: string) => {
    setCurrentSymbol(newSymbol);
  };

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        watchlistCount={watchlistCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar Header */}
        <header className="sticky top-0 z-30 flex flex-col border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">
                  StockScope AI
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">·</span>
                <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                  {stockQuote ? `${stockQuote.exchange} : ${stockQuote.symbol}` : 'Market Research'}
                </span>
              </div>
            </div>

            {/* Top Bar Right: Data Source & Timestamp */}
            <div className="flex items-center gap-3 text-xs">
              {stockQuote && (
                <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className={`inline-block h-2 w-2 rounded-full ${stockQuote.isLive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                  <span>{stockQuote.dataSource}</span>
                  <span>·</span>
                  <span>{formatTimestamp(stockQuote.lastUpdated)}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  loadStockData(currentSymbol);
                  loadHistoryData(currentSymbol, selectedRange);
                }}
                disabled={isLoadingStock}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                title="Refresh current data"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingStock ? 'animate-spin text-emerald-400' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search Header Strip */}
          <div className="border-t border-slate-800/80 px-4 py-3 sm:px-6 bg-slate-900/40">
            <StockSearch
              currentSymbol={currentSymbol}
              onSelectStock={handleSelectStock}
              isLoading={isLoadingStock}
            />
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Error Banner */}
          {stockError && (
            <div className="rounded-2xl border border-rose-800/80 bg-rose-950/30 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                <div className="space-y-1 text-xs text-rose-200">
                  <p className="font-bold text-rose-100 text-sm">{stockError}</p>
                  <p className="text-slate-300">
                    We only display verified real-world figures rather than fabricating data. Try picking from the verified sample companies: AAPL, MSFT, NVDA, AMZN, GOOGL, TSLA, META, AMD, RELIANCE.NS, or TCS.NS.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Message Banner */}
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-[#131d2e] p-6 shadow-xs">
                <div className="max-w-3xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                      Educational Research Platform
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Welcome to StockScope AI
                  </h1>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Explore historical prices, understand financial metrics, and discover what company data may be telling you. Built for students and beginners to learn market fundamentals without Wall Street jargon.
                  </p>
                </div>
              </div>

              {/* Company Profile Brief */}
              {stockQuote && (
                <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-200">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-white">{stockQuote.name}</h2>
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            ({stockQuote.symbol})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {stockQuote.sector} · {stockQuote.industry} · {stockQuote.exchange}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('analyst')}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3.5 py-2 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/25"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Ask AI Analyst</span>
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-300">
                    {stockQuote.description}
                  </p>
                </div>
              )}

              {/* Stock Overview Cards */}
              {stockQuote && <MetricCards stock={stockQuote} />}

              {/* Interactive Stock Price Chart */}
              {stockQuote && (
                <StockChart
                  symbol={stockQuote.symbol}
                  currency={stockQuote.currency}
                  points={historicalPoints}
                  selectedRange={selectedRange}
                  onRangeChange={handleRangeChange}
                  isLoading={isLoadingHistory}
                  dataSource={stockQuote.dataSource}
                />
              )}

              {/* Basic Financial Analysis (Snapshot) */}
              {stockQuote && <FinancialSnapshot stock={stockQuote} />}

              {/* AI Research Summary Report Section */}
              {stockQuote && <ResearchReport stock={stockQuote} />}

              {/* Quick AI Analyst Preview CTA */}
              {stockQuote && (
                <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        <Sparkles className="h-4 w-4" />
                        <span>Interactive AI Tutor</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Have questions about {stockQuote.name}'s chart or metrics?
                      </h3>
                      <p className="text-xs text-slate-300 max-w-xl">
                        Ask our Gemini-powered analyst to explain P/E ratios, profit margins, balance sheet health, or historical trends in beginner-friendly language.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('analyst')}
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
                    >
                      <span>Open AI Analyst Chat</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: STOCK EXPLORER */}
          {activeTab === 'explorer' && stockQuote && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
                <h2 className="text-lg font-bold text-white">Stock Explorer</h2>
                <p className="text-xs text-slate-400">
                  Detailed inspection of price trends, key ratios, and official filings for {stockQuote.name} ({stockQuote.symbol})
                </p>
              </div>

              <MetricCards stock={stockQuote} />

              <StockChart
                symbol={stockQuote.symbol}
                currency={stockQuote.currency}
                points={historicalPoints}
                selectedRange={selectedRange}
                onRangeChange={handleRangeChange}
                isLoading={isLoadingHistory}
                dataSource={stockQuote.dataSource}
              />

              <FinancialSnapshot stock={stockQuote} />
            </div>
          )}

          {/* VIEW: COMPANY COMPARISON */}
          {activeTab === 'comparison' && (
            <CompanyComparison
              initialSymbolA={currentSymbol === 'MSFT' ? 'AAPL' : currentSymbol}
              initialSymbolB={currentSymbol === 'MSFT' ? 'MSFT' : 'MSFT'}
              onSelectCompany={handleSelectStock}
            />
          )}

          {/* VIEW: AI STOCK ANALYST */}
          {activeTab === 'analyst' && stockQuote && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
                <h2 className="text-lg font-bold text-white">AI Stock Analyst</h2>
                <p className="text-xs text-slate-400">
                  Ask questions about {stockQuote.name} ({stockQuote.symbol}) and receive grounded, educational explanations.
                </p>
              </div>

              <AIStockAnalyst stock={stockQuote} />
            </div>
          )}

          {/* VIEW: WATCHLIST */}
          {activeTab === 'watchlist' && stockQuote && (
            <Watchlist
              currentStock={stockQuote}
              onSelectStock={(sym) => {
                handleSelectStock(sym);
                setActiveTab('dashboard');
              }}
              onWatchlistCountChange={setWatchlistCount}
            />
          )}

          {/* VIEW: LEARN STOCK MARKET BASICS */}
          {activeTab === 'learn' && <LearnBasics />}

          {/* VIEW: ABOUT PROJECT */}
          {activeTab === 'about' && <AboutModal />}
        </main>
      </div>
    </div>
  );
}
