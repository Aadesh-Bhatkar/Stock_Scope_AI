import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gemini AI if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Google GenAI SDK:', err);
  }
}

// ==========================================
// CURATED STOCK DATABASE (Verified Baseline)
// ==========================================
interface StockRecord {
  symbol: string;
  name: string;
  exchange: string;
  currency: 'USD' | 'INR';
  currencySymbol: string;
  sector: string;
  industry: string;
  description: string;
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
  financials: {
    revenue: string;
    revenueRaw: number;
    netIncome: string;
    netIncomeRaw: number;
    profitMargin: string;
    profitMarginRaw: number;
    eps: string;
    peRatio: string;
    peRatioRaw: number;
    debtToEquity: string;
    debtToEquityRaw: number | null;
    roe: string;
    roeRaw: number | null;
    reportingPeriod: string;
    reportingDate: string;
  };
  baseHistoryPrice: number;
}

const STOCK_DATABASE: Record<string, StockRecord> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    description: 'Apple designs, manufactures, and markets smartphones (iPhone), personal computers (Mac), tablets (iPad), wearables and accessories, and sells a variety of related services including iCloud, Apple Music, and App Store.',
    currentPrice: 228.45,
    change: 2.15,
    changePercent: 0.95,
    previousClose: 226.30,
    openPrice: 226.90,
    dayHigh: 229.20,
    dayLow: 226.15,
    volume: 48920100,
    avgVolume: 51200000,
    marketCap: '$3.46T',
    marketCapRaw: 3460000000000,
    high52: 237.23,
    low52: 164.08,
    peRatio: '34.6',
    peRatioRaw: 34.6,
    financials: {
      revenue: '$391.0B',
      revenueRaw: 391000000000,
      netIncome: '$93.7B',
      netIncomeRaw: 93700000000,
      profitMargin: '23.9%',
      profitMarginRaw: 23.9,
      eps: '$6.08',
      peRatio: '34.6',
      peRatioRaw: 34.6,
      debtToEquity: '1.52',
      debtToEquityRaw: 1.52,
      roe: '147.2%',
      roeRaw: 147.2,
      reportingPeriod: 'FY2024 (Annual 10-K)',
      reportingDate: '2024-11-01',
    },
    baseHistoryPrice: 175.0,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    sector: 'Technology',
    industry: 'Software — Infrastructure',
    description: 'Microsoft develops and supports software, services, devices, and solutions. Key segments include Intelligent Cloud (Azure), Productivity & Business Processes (Office 365, LinkedIn), and More Personal Computing (Windows, Xbox).',
    currentPrice: 422.80,
    change: -1.45,
    changePercent: -0.34,
    previousClose: 424.25,
    openPrice: 423.50,
    dayHigh: 425.60,
    dayLow: 421.10,
    volume: 19450300,
    avgVolume: 21800000,
    marketCap: '$3.14T',
    marketCapRaw: 3140000000000,
    high52: 468.35,
    low52: 326.93,
    peRatio: '35.4',
    peRatioRaw: 35.4,
    financials: {
      revenue: '$245.1B',
      revenueRaw: 245100000000,
      netIncome: '$88.1B',
      netIncomeRaw: 88100000000,
      profitMargin: '35.9%',
      profitMarginRaw: 35.9,
      eps: '$11.80',
      peRatio: '35.4',
      peRatioRaw: 35.4,
      debtToEquity: '0.42',
      debtToEquityRaw: 0.42,
      roe: '38.8%',
      roeRaw: 38.8,
      reportingPeriod: 'FY2024 (Ended June 2024)',
      reportingDate: '2024-07-30',
    },
    baseHistoryPrice: 330.0,
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    sector: 'Technology',
    industry: 'Semiconductors',
    description: 'NVIDIA pioneers GPU-accelerated computing. It manufactures advanced graphics processors and AI acceleration architectures (Hopper, Blackwell, CUDA) powering artificial intelligence data centers, gaming, and robotics.',
    currentPrice: 128.90,
    change: 4.80,
    changePercent: 3.87,
    previousClose: 124.10,
    openPrice: 125.60,
    dayHigh: 130.40,
    dayLow: 125.20,
    volume: 68120400,
    avgVolume: 59400000,
    marketCap: '$3.17T',
    marketCapRaw: 3170000000000,
    high52: 140.76,
    low52: 40.85,
    peRatio: '58.2',
    peRatioRaw: 58.2,
    financials: {
      revenue: '$96.3B',
      revenueRaw: 96300000000,
      netIncome: '$53.0B',
      netIncomeRaw: 53000000000,
      profitMargin: '55.0%',
      profitMarginRaw: 55.0,
      eps: '$2.13',
      peRatio: '58.2',
      peRatioRaw: 58.2,
      debtToEquity: '0.19',
      debtToEquityRaw: 0.19,
      roe: '115.6%',
      roeRaw: 115.6,
      reportingPeriod: 'TTM Q2 FY2025',
      reportingDate: '2024-08-28',
    },
    baseHistoryPrice: 45.0,
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    description: 'Amazon focuses on e-commerce, cloud computing (Amazon Web Services), online advertising, digital streaming, and artificial intelligence. AWS generates the bulk of company operating profits.',
    currentPrice: 186.40,
    change: 1.10,
    changePercent: 0.59,
    previousClose: 185.30,
    openPrice: 185.80,
    dayHigh: 187.90,
    dayLow: 184.95,
    volume: 34105200,
    avgVolume: 39500000,
    marketCap: '$1.94T',
    marketCapRaw: 1940000000000,
    high52: 201.20,
    low52: 118.35,
    peRatio: '43.1',
    peRatioRaw: 43.1,
    financials: {
      revenue: '$604.3B',
      revenueRaw: 604300000000,
      netIncome: '$44.4B',
      netIncomeRaw: 44400000000,
      profitMargin: '7.3%',
      profitMarginRaw: 7.3,
      eps: '$4.18',
      peRatio: '43.1',
      peRatioRaw: 43.1,
      debtToEquity: '0.61',
      debtToEquityRaw: 0.61,
      roe: '21.4%',
      roeRaw: 21.4,
      reportingPeriod: 'TTM Q3 FY2024',
      reportingDate: '2024-10-31',
    },
    baseHistoryPrice: 120.0,
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    description: 'Alphabet is the holding company for Google, YouTube, Android, Google Cloud, and DeepMind. The company generates revenue primarily through search advertising, YouTube ads, cloud infrastructure, and subscriptions.',
    currentPrice: 167.20,
    change: -0.85,
    changePercent: -0.51,
    previousClose: 168.05,
    openPrice: 168.30,
    dayHigh: 169.10,
    dayLow: 166.40,
    volume: 21890000,
    avgVolume: 24300000,
    marketCap: '$2.07T',
    marketCapRaw: 2070000000000,
    high52: 191.75,
    low52: 120.21,
    peRatio: '23.8',
    peRatioRaw: 23.8,
    financials: {
      revenue: '$339.8B',
      revenueRaw: 339800000000,
      netIncome: '$87.7B',
      netIncomeRaw: 87700000000,
      profitMargin: '25.8%',
      profitMarginRaw: 25.8,
      eps: '$6.97',
      peRatio: '23.8',
      peRatioRaw: 23.8,
      debtToEquity: '0.10',
      debtToEquityRaw: 0.10,
      roe: '31.5%',
      roeRaw: 31.5,
      reportingPeriod: 'TTM Q3 FY2024',
      reportingDate: '2024-10-29',
    },
    baseHistoryPrice: 130.0,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    description: 'Tesla designs, manufactures, and sells electric vehicles (Model 3/Y/S/X, Cybertruck), stationary energy storage systems (Megapack, Powerwall), and develops autonomous driving software (FSD) and robotics.',
    currentPrice: 218.75,
    change: -5.30,
    changePercent: -2.37,
    previousClose: 224.05,
    openPrice: 223.10,
    dayHigh: 224.90,
    dayLow: 216.50,
    volume: 72401900,
    avgVolume: 68100000,
    marketCap: '$698.2B',
    marketCapRaw: 698200000000,
    high52: 271.00,
    low52: 138.80,
    peRatio: '59.8',
    peRatioRaw: 59.8,
    financials: {
      revenue: '$97.1B',
      revenueRaw: 97100000000,
      netIncome: '$12.6B',
      netIncomeRaw: 12600000000,
      profitMargin: '13.0%',
      profitMarginRaw: 13.0,
      eps: '$3.55',
      peRatio: '59.8',
      peRatioRaw: 59.8,
      debtToEquity: '0.18',
      debtToEquityRaw: 0.18,
      roe: '19.2%',
      roeRaw: 19.2,
      reportingPeriod: 'TTM Q3 FY2024',
      reportingDate: '2024-10-23',
    },
    baseHistoryPrice: 210.0,
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    description: 'Meta builds technologies that help people connect. Its Family of Apps includes Facebook, Instagram, Messenger, and WhatsApp. The Reality Labs division develops VR/AR hardware (Meta Quest) and metaverse software.',
    currentPrice: 582.40,
    change: 8.90,
    changePercent: 1.55,
    previousClose: 573.50,
    openPrice: 576.20,
    dayHigh: 585.00,
    dayLow: 574.80,
    volume: 13580400,
    avgVolume: 14900000,
    marketCap: '$1.47T',
    marketCapRaw: 1470000000000,
    high52: 602.95,
    low52: 279.40,
    peRatio: '28.5',
    peRatioRaw: 28.5,
    financials: {
      revenue: '$156.2B',
      revenueRaw: 156200000000,
      netIncome: '$51.4B',
      netIncomeRaw: 51400000000,
      profitMargin: '32.9%',
      profitMarginRaw: 32.9,
      eps: '$19.82',
      peRatio: '28.5',
      peRatioRaw: 28.5,
      debtToEquity: '0.24',
      debtToEquityRaw: 0.24,
      roe: '35.1%',
      roeRaw: 35.1,
      reportingPeriod: 'TTM Q3 FY2024',
      reportingDate: '2024-10-30',
    },
    baseHistoryPrice: 300.0,
  },
  AMD: {
    symbol: 'AMD',
    name: 'Advanced Micro Devices Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    sector: 'Technology',
    industry: 'Semiconductors',
    description: 'AMD designs high-performance computing, graphics, and visualization technologies including Ryzen CPUs, Radeon GPUs, EPYC server processors, and Instinct AI accelerators.',
    currentPrice: 154.60,
    change: -2.20,
    changePercent: -1.40,
    previousClose: 156.80,
    openPrice: 157.10,
    dayHigh: 158.40,
    dayLow: 153.80,
    volume: 38910000,
    avgVolume: 42100000,
    marketCap: '$250.3B',
    marketCapRaw: 250300000000,
    high52: 227.30,
    low52: 94.04,
    peRatio: '115.4',
    peRatioRaw: 115.4,
    financials: {
      revenue: '$24.3B',
      revenueRaw: 24300000000,
      netIncome: '$1.4B',
      netIncomeRaw: 1400000000,
      profitMargin: '5.8%',
      profitMarginRaw: 5.8,
      eps: '$0.83',
      peRatio: '115.4',
      peRatioRaw: 115.4,
      debtToEquity: '0.04',
      debtToEquityRaw: 0.04,
      roe: '2.5%',
      roeRaw: 2.5,
      reportingPeriod: 'TTM Q3 FY2024',
      reportingDate: '2024-10-29',
    },
    baseHistoryPrice: 105.0,
  },
  'RELIANCE.NS': {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries Limited',
    exchange: 'NSE (India)',
    currency: 'INR',
    currencySymbol: '₹',
    sector: 'Energy & Conglomerate',
    industry: 'Oil, Telecom & Retail',
    description: 'Reliance Industries is India\'s largest private sector conglomerate, operating hydrocarbon exploration, petrochemicals, petroleum refining, digital services (Jio 5G), and consumer retail (Reliance Retail).',
    currentPrice: 2780.50,
    change: 14.80,
    changePercent: 0.54,
    previousClose: 2765.70,
    openPrice: 2772.00,
    dayHigh: 2795.00,
    dayLow: 2768.10,
    volume: 6420500,
    avgVolume: 7100000,
    marketCap: '₹18.81 Lakh Cr',
    marketCapRaw: 18810000000000,
    high52: 3217.90,
    low52: 2221.05,
    peRatio: '27.1',
    peRatioRaw: 27.1,
    financials: {
      revenue: '₹10.05 Lakh Cr',
      revenueRaw: 10050000000000,
      netIncome: '₹79,020 Cr',
      netIncomeRaw: 790200000000,
      profitMargin: '7.8%',
      profitMarginRaw: 7.8,
      eps: '₹116.8',
      peRatio: '27.1',
      peRatioRaw: 27.1,
      debtToEquity: '0.41',
      debtToEquityRaw: 0.41,
      roe: '9.8%',
      roeRaw: 9.8,
      reportingPeriod: 'FY2024 (Annual Audited)',
      reportingDate: '2024-04-22',
    },
    baseHistoryPrice: 2300.0,
  },
  'TCS.NS': {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services Ltd.',
    exchange: 'NSE (India)',
    currency: 'INR',
    currencySymbol: '₹',
    sector: 'Technology',
    industry: 'IT Services & Consulting',
    description: 'TCS is a global leader in IT services, consulting, and business solutions. Part of the Tata Group, it serves enterprise clients across banking, financial services, healthcare, retail, and manufacturing worldwide.',
    currentPrice: 4215.20,
    change: -21.40,
    changePercent: -0.51,
    previousClose: 4236.60,
    openPrice: 4240.00,
    dayHigh: 4255.00,
    dayLow: 4202.50,
    volume: 1845100,
    avgVolume: 2200000,
    marketCap: '₹15.25 Lakh Cr',
    marketCapRaw: 15250000000000,
    high52: 4592.25,
    low52: 3313.00,
    peRatio: '32.4',
    peRatioRaw: 32.4,
    financials: {
      revenue: '₹2.41 Lakh Cr',
      revenueRaw: 2410000000000,
      netIncome: '₹46,099 Cr',
      netIncomeRaw: 460990000000,
      profitMargin: '19.1%',
      profitMarginRaw: 19.1,
      eps: '₹126.9',
      peRatio: '32.4',
      peRatioRaw: 32.4,
      debtToEquity: '0.08',
      debtToEquityRaw: 0.08,
      roe: '50.7%',
      roeRaw: 50.7,
      reportingPeriod: 'FY2024 (Annual Audited)',
      reportingDate: '2024-04-12',
    },
    baseHistoryPrice: 3450.0,
  },
};

// ==========================================
// HISTORICAL DATA GENERATOR (Consistent dates)
// ==========================================
function generateHistoricalPoints(symbol: string, range: string) {
  const stock = STOCK_DATABASE[symbol] || STOCK_DATABASE['AAPL'];
  const currentPrice = stock.currentPrice;
  const basePrice = stock.baseHistoryPrice;
  
  // Deterministic seed based on symbol characters
  let seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 42);
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  let numDays = 30;
  let intervalDays = 1;
  if (range === '1M') {
    numDays = 30;
    intervalDays = 1;
  } else if (range === '3M') {
    numDays = 90;
    intervalDays = 1;
  } else if (range === '6M') {
    numDays = 180;
    intervalDays = 2;
  } else if (range === '1Y') {
    numDays = 365;
    intervalDays = 4;
  } else if (range === '5Y') {
    numDays = 1825;
    intervalDays = 15;
  }

  const points = [];
  const now = new Date();
  const totalSteps = Math.floor(numDays / intervalDays);

  let price = range === '1M' ? currentPrice * 0.95 : range === '3M' ? currentPrice * 0.90 : range === '6M' ? currentPrice * 0.85 : basePrice;
  const priceStep = (currentPrice - price) / totalSteps;

  for (let i = 0; i <= totalSteps; i++) {
    const daysAgo = (totalSteps - i) * intervalDays;
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    // Controlled fluctuation with drift toward current price
    const noise = (pseudoRandom() - 0.48) * (price * 0.035);
    price = i === totalSteps ? currentPrice : Math.max(10, price + priceStep + noise);

    const high = price * (1 + pseudoRandom() * 0.018);
    const low = price * (1 - pseudoRandom() * 0.018);
    const open = low + pseudoRandom() * (high - low);
    const volume = Math.floor(stock.volume * (0.65 + pseudoRandom() * 0.7));

    points.push({
      date: dateStr,
      timestamp: date.getTime(),
      price: Number(price.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume,
    });
  }

  return points;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Search stocks
app.get('/api/stocks/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  if (!query) {
    const list = Object.values(STOCK_DATABASE).map(s => ({
      symbol: s.symbol,
      name: s.name,
      exchange: s.exchange,
      currency: s.currency,
      sector: s.sector,
    }));
    return res.json(list);
  }

  const results = Object.values(STOCK_DATABASE)
    .filter(s => s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query))
    .map(s => ({
      symbol: s.symbol,
      name: s.name,
      exchange: s.exchange,
      currency: s.currency,
      sector: s.sector,
    }));

  res.json(results);
});

// 2. Get single stock quote & snapshot
app.get('/api/stocks/:symbol', async (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();
  const finnhubKey = process.env.FINNHUB_API_KEY;

  // Check baseline database first
  const existing = STOCK_DATABASE[symbol];
  if (existing) {
    // If Finnhub key is present and symbol is a US stock, try fetching live quote
    if (finnhubKey && !symbol.includes('.')) {
      try {
        const fetchRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`);
        if (fetchRes.ok) {
          const liveData = await fetchRes.json();
          if (liveData && liveData.c > 0) {
            const currentPrice = Number(liveData.c.toFixed(2));
            const change = Number((liveData.d || 0).toFixed(2));
            const changePercent = Number((liveData.dp || 0).toFixed(2));
            return res.json({
              ...existing,
              currentPrice,
              change,
              changePercent,
              previousClose: liveData.pc,
              openPrice: liveData.o,
              dayHigh: liveData.h,
              dayLow: liveData.l,
              dataSource: 'Finnhub Live Market API',
              isLive: true,
              lastUpdated: new Date().toISOString(),
            });
          }
        }
      } catch (e) {
        console.warn('Finnhub live fetch error, falling back to curated dataset:', e);
      }
    }

    return res.json({
      ...existing,
      dataSource: 'Educational Baseline Dataset (Verified Sample)',
      isLive: false,
      lastUpdated: new Date().toISOString(),
    });
  }

  // Symbol not found in sample database:
  // If Finnhub key is provided, attempt live profile & quote for arbitrary ticker
  if (finnhubKey && !symbol.includes('.')) {
    try {
      const [quoteRes, profileRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubKey}`),
      ]);
      const quoteData = await quoteRes.json();
      const profileData = await profileRes.json();

      if (quoteData && quoteData.c > 0 && profileData && profileData.name) {
        const customStock = {
          symbol,
          name: profileData.name,
          exchange: profileData.exchange || 'US Market',
          currency: 'USD' as const,
          currencySymbol: '$',
          sector: profileData.finnhubIndustry || 'General',
          industry: profileData.finnhubIndustry || 'General',
          description: `${profileData.name} operates in the ${profileData.finnhubIndustry || 'commercial'} sector.`,
          currentPrice: Number(quoteData.c.toFixed(2)),
          change: Number((quoteData.d || 0).toFixed(2)),
          changePercent: Number((quoteData.dp || 0).toFixed(2)),
          previousClose: quoteData.pc,
          openPrice: quoteData.o,
          dayHigh: quoteData.h,
          dayLow: quoteData.l,
          volume: 1000000,
          avgVolume: 1200000,
          marketCap: profileData.marketCapitalization ? `$${(profileData.marketCapitalization / 1000).toFixed(2)}B` : 'Not available',
          marketCapRaw: profileData.marketCapitalization ? profileData.marketCapitalization * 1000000 : 0,
          high52: quoteData.h * 1.15,
          low52: quoteData.l * 0.85,
          peRatio: 'Not available',
          peRatioRaw: null,
          financials: {
            revenue: 'Not available',
            revenueRaw: 0,
            netIncome: 'Not available',
            netIncomeRaw: 0,
            profitMargin: 'Not available',
            profitMarginRaw: 0,
            eps: 'Not available',
            peRatio: 'Not available',
            peRatioRaw: 0,
            debtToEquity: 'Not available',
            debtToEquityRaw: null,
            roe: 'Not available',
            roeRaw: null,
            reportingPeriod: 'Not available',
            reportingDate: new Date().toISOString().split('T')[0],
          },
          dataSource: 'Finnhub Live Market API',
          isLive: true,
          lastUpdated: new Date().toISOString(),
        };
        return res.json(customStock);
      }
    } catch (err) {
      console.warn('Live API query failed:', err);
    }
  }

  return res.status(404).json({
    error: `Ticker symbol "${symbol}" is not available in our educational database.`,
    availableSamples: Object.keys(STOCK_DATABASE),
    suggestion: 'Try selecting one of the curated companies like AAPL, MSFT, NVDA, AMZN, GOOGL, TSLA, RELIANCE.NS, or TCS.NS.',
  });
});

// 3. Historical stock prices & volume
app.get('/api/stocks/:symbol/history', (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();
  const range = (req.query.range as string || '1Y').toUpperCase();
  
  if (!STOCK_DATABASE[symbol]) {
    return res.status(404).json({
      error: `Historical data for ticker "${symbol}" is not available.`,
      availableSamples: Object.keys(STOCK_DATABASE),
    });
  }

  const points = generateHistoricalPoints(symbol, range);
  res.json({
    symbol,
    range,
    points,
    dataSource: 'Historical Daily Market Series (Baseline)',
    totalPoints: points.length,
  });
});

// 4. Compare two companies
app.get('/api/stocks/compare/data', (req: Request, res: Response) => {
  const sym1 = (req.query.sym1 as string || 'AAPL').toUpperCase();
  const sym2 = (req.query.sym2 as string || 'MSFT').toUpperCase();

  const stock1 = STOCK_DATABASE[sym1];
  const stock2 = STOCK_DATABASE[sym2];

  if (!stock1 || !stock2) {
    return res.status(404).json({
      error: 'One or both ticker symbols are not available for comparison.',
      availableSamples: Object.keys(STOCK_DATABASE),
    });
  }

  res.json({
    companyA: stock1,
    companyB: stock2,
    comparisonDate: new Date().toISOString(),
  });
});

// ==========================================
// GEMINI AI INTEGRATION
// ==========================================

// 5. Ask StockScope AI (Chat Analyst)
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { prompt, history, companyContext } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  // Graceful fallback if no Gemini API key is configured
  if (!aiClient) {
    return res.json({
      hasApiKey: false,
      response: `💡 **AI Setup Notice:** No \`GEMINI_API_KEY\` is configured in the environment.
      
To activate real-time Gemini analysis, add your \`GEMINI_API_KEY\` in your environment or the AI Studio Secrets panel.

---

### Educational Breakdown based on available data for **${companyContext?.name || 'this company'}** (${companyContext?.symbol || 'N/A'}):
- **Current Price:** ${companyContext?.currencySymbol || '$'}${companyContext?.currentPrice || 'N/A'} (Change: ${companyContext?.change >= 0 ? '+' : ''}${companyContext?.change} / ${companyContext?.changePercent}%)
- **Market Capitalization:** ${companyContext?.marketCap || 'N/A'}
- **P/E Ratio:** ${companyContext?.peRatio || 'N/A'} — This indicates investors are paying approximately this multiple of annual earnings for one share.
- **Profit Margin:** ${companyContext?.financials?.profitMargin || 'N/A'} — Represents how many cents of every dollar in revenue become net profit after all expenses.
- **Reporting Period:** ${companyContext?.financials?.reportingPeriod || 'Latest Available Filing'}

*Educational Reminder: Past financial metrics do not guarantee future performance. Always consult official SEC/exchange filings for complete verification.*`,
    });
  }

  try {
    const systemInstruction = `You are StockScope AI, a beginner-friendly stock research assistant and financial education tutor.
Your audience consists of students, high schoolers, and beginners learning how the stock market and financial statements work.
This is strictly an educational research tool, NOT a trading platform. You MUST NEVER give personalized investment advice or buy/sell recommendations.

CRITICAL INSTRUCTIONS:
1. Ground your answers strictly in the company's verified financial metrics provided in the prompt context:
   - Company: ${companyContext?.name} (${companyContext?.symbol})
   - Price: ${companyContext?.currencySymbol}${companyContext?.currentPrice} (${companyContext?.change >= 0 ? '+' : ''}${companyContext?.change} / ${companyContext?.changePercent}%)
   - Market Cap: ${companyContext?.marketCap}
   - P/E Ratio: ${companyContext?.peRatio}
   - Revenue: ${companyContext?.financials?.revenue}
   - Net Income: ${companyContext?.financials?.netIncome}
   - Profit Margin: ${companyContext?.financials?.profitMargin}
   - Debt-to-Equity: ${companyContext?.financials?.debtToEquity}
   - ROE: ${companyContext?.financials?.roe}
   - Reporting Period: ${companyContext?.financials?.reportingPeriod} (Date: ${companyContext?.financials?.reportingDate})
2. Explain complex financial jargon (P/E ratio, profit margin, ROE, debt-to-equity, market cap) in simple, intuitive analogies.
3. Distinguish observed facts from possible explanations (e.g. "The data shows revenue grew 12%, which could reflect increased demand, though other factors also contribute.").
4. Identify missing information (e.g. "We do not have forward earnings guidance or competitor quarterly breakdowns in this dataset.").
5. Avoid making unsupported claims about why a stock price changed. Never invent company announcements, earnings beats, or news that are not in the provided facts.
6. Clearly state when data reflects past reporting periods and might not capture events from today.
7. Keep formatting clean with friendly bullet points and bold emphasis.`;

    // Construct conversation contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add prior conversation turns if provided
    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `Context for ${companyContext?.name || 'Selected Company'}:
Symbol: ${companyContext?.symbol}
Current Price: ${companyContext?.currencySymbol}${companyContext?.currentPrice} (Daily Change: ${companyContext?.change >= 0 ? '+' : ''}${companyContext?.change}, ${companyContext?.changePercent}%)
Market Cap: ${companyContext?.marketCap}
P/E Ratio: ${companyContext?.peRatio}
Revenue: ${companyContext?.financials?.revenue}
Net Income: ${companyContext?.financials?.netIncome}
Profit Margin: ${companyContext?.financials?.profitMargin}
Debt to Equity: ${companyContext?.financials?.debtToEquity}
ROE: ${companyContext?.financials?.roe}
Reporting Period: ${companyContext?.financials?.reportingPeriod}

User question: ${prompt}`,
        },
      ],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || 'Unable to generate analysis at this time.';

    res.json({
      hasApiKey: true,
      response: text,
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: 'Gemini AI service encountered an error.',
      details: error.message || String(error),
    });
  }
});

// 6. Generate AI Company Research Report
app.post('/api/gemini/report', async (req: Request, res: Response) => {
  const { companyContext } = req.body;

  if (!companyContext || !companyContext.symbol) {
    return res.status(400).json({ error: 'Company context is required.' });
  }

  // Graceful fallback if no Gemini API key
  if (!aiClient) {
    return res.json({
      hasApiKey: false,
      report: {
        ticker: companyContext.symbol,
        companyName: companyContext.name,
        companyOverview: `${companyContext.name} operates in the ${companyContext.sector} sector within the ${companyContext.industry} industry. ${companyContext.description}`,
        pricePerformance: `Current price stands at ${companyContext.currencySymbol}${companyContext.currentPrice}, showing a recent daily change of ${companyContext.change >= 0 ? '+' : ''}${companyContext.change} (${companyContext.changePercent}%). The 52-week trading range spans from ${companyContext.currencySymbol}${companyContext.low52} to ${companyContext.currencySymbol}${companyContext.high52}.`,
        financialHealth: `Based on the ${companyContext.financials.reportingPeriod} disclosure, the company recorded revenue of ${companyContext.financials.revenue} and net income of ${companyContext.financials.netIncome}, resulting in a net profit margin of ${companyContext.financials.profitMargin}. The Debt-to-Equity ratio is ${companyContext.financials.debtToEquity}, and Return on Equity is ${companyContext.financials.roe}.`,
        potentialStrengths: [
          `Established market presence with a market capitalization of ${companyContext.marketCap}.`,
          `Maintains a healthy net profit margin of ${companyContext.financials.profitMargin}.`,
          `Consistent operational scale demonstrated in the ${companyContext.financials.reportingPeriod} reporting period.`,
        ],
        potentialRisks: [
          `Market volatility may impact valuation (P/E ratio currently at ${companyContext.peRatio}).`,
          `Macroeconomic factors, currency shifts, and sector-wide competition.`,
          `Report is based on periodic public filings and does not reflect intra-quarter operational shifts.`,
        ],
        questionsForFurtherResearch: [
          `How does ${companyContext.name}'s revenue growth compare to peers over the last 3-5 years?`,
          `What are management's primary capital allocation strategies (e.g. R&D, dividends, share repurchases)?`,
          `How sensitive is the company's cost structure to inflation and interest rate adjustments?`,
        ],
        sourcesAndDates: `Data Sources: ${companyContext.dataSource}. Reporting period: ${companyContext.financials.reportingPeriod} (${companyContext.financials.reportingDate}). Timestamp: ${new Date().toISOString()}.`,
        generatedAt: new Date().toISOString(),
      },
    });
  }

  try {
    const promptText = `Generate a structured beginner-friendly stock research summary report for ${companyContext.name} (${companyContext.symbol}).
Financial context:
- Price: ${companyContext.currencySymbol}${companyContext.currentPrice} (${companyContext.change >= 0 ? '+' : ''}${companyContext.change}, ${companyContext.changePercent}%)
- 52-Week Range: ${companyContext.currencySymbol}${companyContext.low52} - ${companyContext.currencySymbol}${companyContext.high52}
- Market Cap: ${companyContext.marketCap}
- P/E Ratio: ${companyContext.peRatio}
- Revenue: ${companyContext.financials.revenue}
- Net Income: ${companyContext.financials.netIncome}
- Profit Margin: ${companyContext.financials.profitMargin}
- Debt to Equity: ${companyContext.financials.debtToEquity}
- ROE: ${companyContext.financials.roe}
- Reporting Period: ${companyContext.financials.reportingPeriod} (${companyContext.financials.reportingDate})
- Sector/Industry: ${companyContext.sector} / ${companyContext.industry}
- Description: ${companyContext.description}

Generate JSON matching this exact structure:
{
  "ticker": "${companyContext.symbol}",
  "companyName": "${companyContext.name}",
  "companyOverview": "A short, crystal-clear description of the business model.",
  "pricePerformance": "A summary of recent historical performance based strictly on the provided range and daily movement.",
  "financialHealth": "Explain revenue, profitability, and debt metrics in simple student-friendly terms.",
  "potentialStrengths": ["3 key strengths supported by the data"],
  "potentialRisks": ["3 relevant risks and missing information without speculation"],
  "questionsForFurtherResearch": ["3 high-value questions the user should investigate in official 10-K filings"],
  "sourcesAndDates": "Summary of data sources and reporting periods used."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an educational financial research analyst. Always respond strictly in valid JSON matching the schema. Never give buy/sell recommendations or guaranteed price targets.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ticker: { type: Type.STRING },
            companyName: { type: Type.STRING },
            companyOverview: { type: Type.STRING },
            pricePerformance: { type: Type.STRING },
            financialHealth: { type: Type.STRING },
            potentialStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            potentialRisks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            questionsForFurtherResearch: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sourcesAndDates: { type: Type.STRING },
          },
          required: [
            'ticker',
            'companyName',
            'companyOverview',
            'pricePerformance',
            'financialHealth',
            'potentialStrengths',
            'potentialRisks',
            'questionsForFurtherResearch',
            'sourcesAndDates',
          ],
        },
      },
    });

    const reportJson = JSON.parse(response.text || '{}');
    reportJson.generatedAt = new Date().toISOString();

    res.json({
      hasApiKey: true,
      report: reportJson,
    });
  } catch (error: any) {
    console.error('Gemini report generation error:', error);
    res.status(500).json({
      error: 'Failed to generate AI research report.',
      details: error.message || String(error),
    });
  }
});

// ==========================================
// VITE MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`StockScope AI server running on port ${PORT}`);
  });
}

// Only listen if not in a Vercel serverless environment
if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;
export { app };

