import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Calendar,
  Building,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { StockQuote, ResearchSummaryReport } from '../types/stock';
import { generateResearchReport } from '../services/geminiService';
import { formatTimestamp } from '../utils/formatters';

interface ResearchReportProps {
  stock: StockQuote;
}

export const ResearchReport: React.FC<ResearchReportProps> = ({ stock }) => {
  const [report, setReport] = useState<ResearchSummaryReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await generateResearchReport(stock);
      setReport(response.report);
    } catch (err: any) {
      setError(err.message || 'Failed to generate research summary report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    if (!report) return;

    const formattedReportText = `=========================================
STOCKSCOPE AI RESEARCH SUMMARY REPORT
Company: ${report.companyName} (${report.ticker})
Date Generated: ${report.generatedAt}
=========================================

1. COMPANY OVERVIEW
${report.companyOverview}

2. PRICE PERFORMANCE
${report.pricePerformance}

3. FINANCIAL HEALTH
${report.financialHealth}

4. POTENTIAL STRENGTHS
${report.potentialStrengths.map((s, idx) => `• ${s}`).join('\n')}

5. POTENTIAL RISKS & MISSING INFORMATION
${report.potentialRisks.map((r, idx) => `• ${r}`).join('\n')}

6. QUESTIONS FOR FURTHER RESEARCH
${report.questionsForFurtherResearch.map((q, idx) => `• ${q}`).join('\n')}

7. SOURCES AND DATA DATES
${report.sourcesAndDates}

DISCLAIMER: This report is generated strictly for educational study and research purposes. It does not contain investment recommendations or guaranteed price targets.
=========================================`;

    navigator.clipboard.writeText(formattedReportText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-[#0F172A] p-5">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              AI Company Research Summary
            </h3>
            <p className="text-xs text-slate-400">
              One-click structured brief synthesized from verified financials and market history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {report && (
            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
            >
              {hasCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied Report!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Generating Summary...' : report ? 'Regenerate Report' : 'Generate Research Summary'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-900/60 bg-rose-950/20 p-3.5 text-xs text-rose-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* When no report generated yet */}
      {!report && !isGenerating && (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
          <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">
            No report generated yet for {stock.name} ({stock.symbol})
          </h4>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            Click <strong>"Generate Research Summary"</strong> above to produce a structured student-friendly breakdown of company health, risks, strengths, and study questions.
          </p>
        </div>
      )}

      {/* Loading state skeleton */}
      {isGenerating && (
        <div className="space-y-4 py-6">
          <div className="flex items-center justify-center gap-3 text-sm text-emerald-400">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400" />
            <span>Synthesizing balance sheet, profit margins, and price range with Gemini...</span>
          </div>
          <div className="space-y-2 opacity-40">
            <div className="h-4 w-3/4 rounded bg-slate-800 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-slate-800 animate-pulse" />
          </div>
        </div>
      )}

      {/* Rendered Structured Report */}
      {report && !isGenerating && (
        <div className="space-y-6 pt-2">
          {/* Section 1: Overview */}
          <div className="space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Building className="h-4 w-4" />
              <span>1. Company Overview</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {report.companyOverview}
            </p>
          </div>

          {/* Section 2: Price Performance */}
          <div className="space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <TrendingUp className="h-4 w-4" />
              <span>2. Price Performance</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {report.pricePerformance}
            </p>
          </div>

          {/* Section 3: Financial Health */}
          <div className="space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Activity className="h-4 w-4" />
              <span>3. Financial Health & Balance Sheet</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {report.financialHealth}
            </p>
          </div>

          {/* Section 4 & 5: Strengths & Risks (Side by Side) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-emerald-950/60 bg-emerald-950/10 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>4. Potential Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs leading-relaxed text-slate-300">
                {report.potentialStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 rounded-xl border border-rose-950/60 bg-rose-950/10 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                <ShieldAlert className="h-4 w-4" />
                <span>5. Potential Risks & Missing Info</span>
              </div>
              <ul className="space-y-1.5 text-xs leading-relaxed text-slate-300">
                {report.potentialRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-rose-400">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 6: Questions for Further Research */}
          <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <HelpCircle className="h-4 w-4" />
              <span>6. Questions for Further Research</span>
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-slate-300">
              {report.questionsForFurtherResearch.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-indigo-400">{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 7: Sources & Data Dates */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{report.sourcesAndDates}</span>
            </div>
            <div className="font-mono text-[11px] text-slate-400">
              Generated: {formatTimestamp(report.generatedAt)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
