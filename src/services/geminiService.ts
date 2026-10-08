import { StockQuote, ChatMessage, ResearchSummaryReport } from '../types/stock';

export interface ChatResponse {
  hasApiKey: boolean;
  response: string;
  error?: string;
}

export interface ReportResponse {
  hasApiKey: boolean;
  report: ResearchSummaryReport;
  error?: string;
}

/**
 * Send chat query to Gemini via backend server
 */
export async function sendChatMessage(
  prompt: string,
  history: ChatMessage[],
  companyContext: StockQuote
): Promise<ChatResponse> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      history,
      companyContext,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.details || 'Gemini chat request failed');
  }

  return res.json();
}

/**
 * Request full structured research summary report from Gemini via backend server
 */
export async function generateResearchReport(
  companyContext: StockQuote
): Promise<ReportResponse> {
  const res = await fetch('/api/gemini/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyContext,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.details || 'Failed to generate research report');
  }

  return res.json();
}
