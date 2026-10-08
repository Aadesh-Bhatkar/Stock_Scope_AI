import { StockQuote, StockSearchResult, HistoricalDataPoint, TimeRange } from '../types/stock';

export interface HistoryResponse {
  symbol: string;
  range: TimeRange;
  points: HistoricalDataPoint[];
  dataSource: string;
  totalPoints: number;
}

export interface ComparisonResponse {
  companyA: StockQuote;
  companyB: StockQuote;
  comparisonDate: string;
}

/**
 * Fetch detailed stock quote and financial snapshot
 */
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch data for ticker "${symbol}"`);
  }
  return res.json();
}

/**
 * Fetch historical price and volume data points
 */
export async function getStockHistory(symbol: string, range: TimeRange = '1Y'): Promise<HistoryResponse> {
  const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}/history?range=${range}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch historical data for "${symbol}"`);
  }
  return res.json();
}

/**
 * Search stocks by symbol or company name
 */
export async function searchStocks(query: string = ''): Promise<StockSearchResult[]> {
  const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error('Search failed');
  }
  return res.json();
}

/**
 * Fetch comparison data between two companies
 */
export async function compareCompanies(symbolA: string, symbolB: string): Promise<ComparisonResponse> {
  const res = await fetch(`/api/stocks/compare/data?sym1=${encodeURIComponent(symbolA)}&sym2=${encodeURIComponent(symbolB)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Comparison data retrieval failed');
  }
  return res.json();
}
