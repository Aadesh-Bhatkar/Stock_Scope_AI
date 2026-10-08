import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Code2,
  Database,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const AboutModal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Brand Hero */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex items-center gap-3.5 border-b border-slate-800 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">StockScope AI</h2>
            <p className="text-sm font-medium text-emerald-400">
              "Understand the market. Explore the numbers."
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            <strong>StockScope AI</strong> is a beginner-friendly web application created to teach students, beginners, and individual investors how to read stock market metrics, inspect historical price patterns, and interpret financial disclosures in simple, human language.
          </p>
          <p>
            Unlike speculative trading applications designed to encourage high-frequency buying and selling, StockScope AI focuses strictly on financial literacy, balance sheet health, and objective data transparency.
          </p>
        </div>
      </div>

      {/* Critical Educational Disclaimer */}
      <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div className="space-y-1.5 text-xs text-amber-200 leading-relaxed">
            <h3 className="text-sm font-bold text-amber-100">
              Important Educational Notice & Disclaimer
            </h3>
            <p>
              StockScope AI is <strong>NOT a trading platform, broker-dealer, or registered investment advisor</strong>. It does not execute trades, facilitate transactions, or provide personalized financial advice.
            </p>
            <p>
              Historical prices, P/E ratios, profit margins, and AI explanations are provided strictly for educational study. Past performance does not guarantee future results. Never make real financial decisions without reviewing official SEC/regulatory filings and consulting a certified financial professional.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Code2 className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Technology Stack</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <span className="font-bold text-emerald-400">Frontend UI</span>
            <p className="mt-1 text-slate-300">React 19 & Vite SPA with Tailwind CSS v4</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <span className="font-bold text-cyan-400">Interactive Charts</span>
            <p className="mt-1 text-slate-300">Recharts Area & Bar Charts with tooltips & ranges</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <span className="font-bold text-indigo-400">AI Intelligence</span>
            <p className="mt-1 text-slate-300">Google Gemini API (@google/genai SDK on server)</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <span className="font-bold text-amber-400">Icons & Visuals</span>
            <p className="mt-1 text-slate-300">Lucide React cleanly coupled to finance metrics</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <span className="font-bold text-purple-400">Local Persistence</span>
            <p className="mt-1 text-slate-300">HTML5 LocalStorage for custom Watchlists</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <span className="font-bold text-emerald-400">Security Architecture</span>
            <p className="mt-1 text-slate-300">Server-side proxy; zero exposed client API secrets</p>
          </div>
        </div>
      </div>

      {/* Data Sources and Methodology */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Data Integration & Transparency</h3>
        </div>

        <p className="text-xs leading-relaxed text-slate-300">
          The dashboard operates on two distinct, un-conflated tiers:
        </p>

        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-400">1.</span>
            <span>
              <strong className="text-slate-200">Curated Educational Baseline:</strong> Verified historical balance sheet data, 10-K filing metrics, and multi-year time-series for major benchmark companies (Apple, Microsoft, NVIDIA, Amazon, Alphabet, Tesla, Reliance, TCS).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-400">2.</span>
            <span>
              <strong className="text-slate-200">Live API Tier (Optional):</strong> When a <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-200">FINNHUB_API_KEY</code> is present in environment variables, the backend server seamlessly fetches live market quotes.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
