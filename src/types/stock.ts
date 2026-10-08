export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

export interface FinancialSnapshot {
  revenue: string; // e.g. "$391.0B" or "₹10.05T"
  revenueRaw: number; // in base units
  netIncome: string; // e.g. "$93.7B" or "₹79,020 Cr"
  netIncomeRaw: number;
  profitMargin: string; // e.g. "23.9%"
  profitMarginRaw: number;
  eps: string; // e.g. "$6.08"
  peRatio: string; // e.g. "34.2"
  peRatioRaw: number;
  debtToEquity: string; // e.g. "1.45" or "Not available"
  debtToEquityRaw: number | null;
  roe: string; // e.g. "147.2%" or "48.5%"
  roeRaw: number | null;
  reportingPeriod: string; // e.g. "Q4 FY2024 (Annualized)"
  reportingDate: string; // e.g. "2024-11-02"
}

export interface HistoricalDataPoint {
  date: string;
  timestamp: number;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export type TimeRange = '1M' | '3M' | '6M' | '1Y' | '5Y';

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  currency: Currency;
  currencySymbol: string;
  sector: string;
  industry: string;
  description: string;
  
  // Real-time or latest available metrics
  currentPrice: number;
  change: number;
  changePercent: number;
  previousClose: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  marketCap: string;
  marketCapRaw: number;
  high52: number;
  low52: number;
  peRatio: string;
  peRatioRaw: number | null;

  // Financial Snapshot
  financials: FinancialSnapshot;

  // Metadata
  dataSource: string; // e.g. "Educational Baseline Dataset" | "Finnhub Live API"
  isLive: boolean;
  lastUpdated: string;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  currency: Currency;
  sector: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  currency: Currency;
  currencySymbol: string;
  change: number;
  changePercent: number;
  lastUpdated: string;
  isLive: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface ResearchSummaryReport {
  companyOverview: string;
  pricePerformance: string;
  financialHealth: string;
  potentialStrengths: string[];
  potentialRisks: string[];
  questionsForFurtherResearch: string[];
  sourcesAndDates: string;
  generatedAt: string;
  ticker: string;
  companyName: string;
}
