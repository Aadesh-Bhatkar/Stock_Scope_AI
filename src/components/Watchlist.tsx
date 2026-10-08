import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ArrowUpRight, ArrowDownRight, ExternalLink, Plus, RefreshCw } from 'lucide-react';
import { WatchlistItem, StockQuote } from '../types/stock';
import { formatCurrency, formatPercent, formatTimestamp } from '../utils/formatters';
import { getStockQuote } from '../services/stockApi';

interface WatchlistProps {
  currentStock: StockQuote;
  onSelectStock: (symbol: string) => void;
  onWatchlistCountChange?: (count: number) => void;
}

const STORAGE_KEY = 'stockscope_watchlist_v1';

export const Watchlist: React.FC<WatchlistProps> = ({
  currentStock,
  onSelectStock,
  onWatchlistCountChange,
}) => {
  const [items, setItems] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse watchlist from storage:', e);
    }
    // Default initial seed
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 228.45,
        currency: 'USD',
        currencySymbol: '$',
        change: 2.15,
        changePercent: 0.95,
        lastUpdated: new Date().toISOString(),
        isLive: false,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 422.80,
        currency: 'USD',
        currencySymbol: '$',
        change: -1.45,
        changePercent: -0.34,
        lastUpdated: new Date().toISOString(),
        isLive: false,
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 128.90,
        currency: 'USD',
        currencySymbol: '$',
        change: 4.80,
        changePercent: 3.87,
        lastUpdated: new Date().toISOString(),
        isLive: false,
      },
    ];
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      onWatchlistCountChange?.(items.length);
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage:', e);
    }
  }, [items, onWatchlistCountChange]);

  const isInWatchlist = items.some((i) => i.symbol === currentStock.symbol);

  const handleToggleCurrentStock = () => {
    if (isInWatchlist) {
      setItems((prev) => prev.filter((i) => i.symbol !== currentStock.symbol));
    } else {
      const newItem: WatchlistItem = {
        symbol: currentStock.symbol,
        name: currentStock.name,
        price: currentStock.currentPrice,
        currency: currentStock.currency,
        currencySymbol: currentStock.currencySymbol,
        change: currentStock.change,
        changePercent: currentStock.changePercent,
        lastUpdated: currentStock.lastUpdated,
        isLive: currentStock.isLive,
      };
      setItems((prev) => [newItem, ...prev]);
    }
  };

  const handleRemoveItem = (symbol: string) => {
    setItems((prev) => prev.filter((i) => i.symbol !== symbol));
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      const updated = await Promise.all(
        items.map(async (item) => {
          try {
            const fresh = await getStockQuote(item.symbol);
            return {
              ...item,
              price: fresh.currentPrice,
              change: fresh.change,
              changePercent: fresh.changePercent,
              lastUpdated: fresh.lastUpdated,
              isLive: fresh.isLive,
            };
          } catch {
            return item;
          }
        })
      );
      setItems(updated);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Your Research Watchlist</h3>
              <span className="font-mono text-xs rounded-md bg-slate-800 px-2 py-0.5 text-slate-300">
                {items.length} {items.length === 1 ? 'company' : 'companies'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Persistent browser bookmarking for fast tracking and comparison
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Current Stock CTA */}
          <button
            type="button"
            onClick={handleToggleCurrentStock}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              isInWatchlist
                ? 'border border-rose-800/80 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40'
                : 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
            }`}
          >
            {isInWatchlist ? (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove {currentStock.symbol}</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Add {currentStock.symbol} to Watchlist</span>
              </>
            )}
          </button>

          {/* Refresh all */}
          <button
            type="button"
            disabled={isRefreshing || items.length === 0}
            onClick={handleRefreshAll}
            className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            title="Refresh quote data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Watchlist Grid / Table */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">Your Watchlist is empty</h4>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Click <strong>"Add {currentStock.symbol} to Watchlist"</strong> or explore stocks to build your personal research board.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isPos = item.change >= 0;
            return (
              <div
                key={item.symbol}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700 hover:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm font-bold text-emerald-400">
                        {item.symbol}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectStock(item.symbol)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        title="Load into dashboard"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.symbol)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-950/40 hover:text-rose-400"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="font-mono text-xl font-bold tabular-nums text-white">
                      {formatCurrency(item.price, item.currency)}
                    </div>
                    <div
                      className={`flex items-center gap-0.5 font-mono text-xs font-semibold tabular-nums ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      <span>{formatPercent(item.changePercent)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${item.isLive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                    {item.isLive ? 'Live API' : 'Baseline'}
                  </span>
                  <span>{formatTimestamp(item.lastUpdated)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
