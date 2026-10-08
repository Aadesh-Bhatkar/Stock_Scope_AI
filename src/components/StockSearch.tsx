import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Building2, Globe2 } from 'lucide-react';
import { StockSearchResult } from '../types/stock';
import { searchStocks } from '../services/stockApi';

interface StockSearchProps {
  currentSymbol: string;
  onSelectStock: (symbol: string) => void;
  isLoading?: boolean;
}

const SAMPLE_COMPANIES = [
  { symbol: 'AAPL', name: 'Apple', market: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft', market: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA', market: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon', market: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet', market: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla', market: 'NASDAQ' },
  { symbol: 'META', name: 'Meta', market: 'NASDAQ' },
  { symbol: 'AMD', name: 'AMD', market: 'NASDAQ' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Ind.', market: 'NSE' },
  { symbol: 'TCS.NS', name: 'TCS', market: 'NSE' },
];

export const StockSearch: React.FC<StockSearchProps> = ({
  currentSymbol,
  onSelectStock,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results debounced
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setSearchError(null);
        return;
      }
      setIsSearching(true);
      setSearchError(null);
      try {
        const data = await searchStocks(query.trim());
        setResults(data);
        if (data.length === 0) {
          setSearchError(`No verified stocks found matching "${query}". Check symbol or select a sample.`);
        }
      } catch (err: any) {
        setSearchError('Search request failed. Please check network.');
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setQuery('');
    setIsDropdownOpen(false);
    setSearchError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSelect(query.trim().toUpperCase());
    }
  };

  return (
    <div className="w-full space-y-3" ref={dropdownRef}>
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Search by company name or ticker (e.g., AAPL, NVDA, Reliance)..."
          className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 shadow-inner outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setSearchError(null);
            }}
            className="absolute right-3 rounded p-1 text-slate-400 hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Dropdown Results */}
        {isDropdownOpen && (query.trim().length > 0 || results.length > 0) && (
          <div className="absolute top-full left-0 z-50 mt-1.5 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-700 bg-[#0F172A] p-2 shadow-2xl backdrop-blur-md">
            {isSearching ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Searching company directory...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Matching Companies ({results.length})
                </div>
                {results.map((item) => (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => handleSelect(item.symbol)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                      currentSymbol === item.symbol
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.sector}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {item.symbol}
                      </span>
                      <div className="text-[11px] text-slate-400">{item.exchange}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchError ? (
              <div className="p-4 text-center">
                <p className="text-xs text-amber-300">{searchError}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Select a sample company below to continue exploring.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </form>

      {/* Quick Sample Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <Globe2 className="h-3 w-3" /> Sample Companies:
        </span>
        {SAMPLE_COMPANIES.map((company) => {
          const isSelected = currentSymbol === company.symbol;
          return (
            <button
              key={company.symbol}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelect(company.symbol)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs ring-1 ring-emerald-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <span className="font-mono">{company.symbol}</span>
              <span className="ml-1 opacity-75 hidden sm:inline">({company.market})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
