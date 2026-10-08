import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Key,
} from 'lucide-react';
import { StockQuote, ChatMessage } from '../types/stock';
import { sendChatMessage } from '../services/geminiService';

interface AIStockAnalystProps {
  stock: StockQuote;
}

const PRESET_QUESTIONS = [
  "Explain this company's recent stock performance.",
  "What does its P/E ratio mean?",
  "How has its revenue changed?",
  "What are the main financial strengths and risks?",
  "Explain this chart in beginner-friendly language.",
  "What does its profit margin tell a student investor?",
];

export const AIStockAnalyst: React.FC<AIStockAnalystProps> = ({ stock }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **StockScope AI Financial Tutor**. 
      
I can explain **${stock.name} (${stock.symbol})**'s stock prices, quarterly financial metrics, and market terms in clear, simple language without Wall Street jargon.

Ask a question below or click any of the suggested topics!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopiedId, setHasCopiedId] = useState<string | null>(null);
  const [apiKeyMissingNotice, setApiKeyMissingNotice] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(prompt, messages, stock);
      if (!response.hasApiKey) {
        setApiKeyMissingNotice(true);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Service Notice:** Unable to reach the AI model: ${err.message || 'Network error'}. Please verify your connection or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopiedId(id);
    setTimeout(() => setHasCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared. What would you like to explore regarding **${stock.name} (${stock.symbol})**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex h-[640px] flex-col rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Ask StockScope AI</h3>
              <span className="font-mono text-xs text-slate-400">
                · {stock.symbol} ({stock.currency})
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Plain-language answers grounded strictly in verified corporate filings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
          title="Reset conversation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* API Key Banner if in fallback mode */}
      {apiKeyMissingNotice && (
        <div className="flex items-center justify-between border-b border-amber-900/60 bg-amber-950/20 px-4 py-2 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" />
            <span>
              <strong>Note:</strong> Currently operating with educational data formulas. Configure <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded">GEMINI_API_KEY</code> for dynamic multi-turn Gemini reasoning.
            </span>
          </div>
          <button
            onClick={() => setApiKeyMissingNotice(false)}
            className="text-amber-400 hover:text-amber-200 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Messages Viewport */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`group relative max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-xs'
                    : msg.isError
                    ? 'border border-rose-800 bg-rose-950/30 text-rose-200 rounded-tl-xs'
                    : 'border border-slate-800 bg-slate-900/90 text-slate-200 rounded-tl-xs'
                }`}
              >
                {/* Message prose formatted */}
                <div className="whitespace-pre-wrap text-xs sm:text-sm">
                  {msg.content}
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                  <span className="font-mono">{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="opacity-0 transition group-hover:opacity-100 hover:text-white"
                      title="Copy response"
                    >
                      {hasCopiedId === msg.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-400">
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-300 font-mono">StockScope AI is synthesizing data...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Preset Questions Drawer */}
      <div className="border-t border-slate-800/80 bg-slate-900/60 p-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 whitespace-nowrap pl-1">
            <HelpCircle className="h-3 w-3" /> Questions:
          </span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(q)}
              className="rounded-lg border border-slate-800 bg-slate-800/70 px-2.5 py-1 text-[11px] font-medium text-slate-300 whitespace-nowrap transition hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 border-t border-slate-800 bg-slate-900 p-3"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Ask anything about ${stock.symbol}'s financial metrics or stock behavior...`}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
