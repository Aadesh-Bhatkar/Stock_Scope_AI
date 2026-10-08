import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  GitCompare,
  Sparkles,
  Bookmark,
  GraduationCap,
  Info,
  X,
  ShieldCheck,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'explorer'
  | 'comparison'
  | 'analyst'
  | 'watchlist'
  | 'learn'
  | 'about';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  watchlistCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  watchlistCount,
  isOpen,
  onClose,
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Stock Explorer', icon: TrendingUp },
    { id: 'comparison', label: 'Company Comparison', icon: GitCompare },
    { id: 'analyst', label: 'AI Stock Analyst', icon: Sparkles },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, count: watchlistCount },
    { id: 'learn', label: 'Stock Market Basics', icon: GraduationCap },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0F172A] transition-transform duration-200 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">StockScope AI</span>
              <p className="text-[11px] font-medium text-slate-400">Research & Learn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tagline Banner */}
        <div className="border-b border-slate-800/80 bg-slate-900/60 px-5 py-2.5">
          <p className="text-xs text-slate-400">
            "Understand the market. Explore the numbers."
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="font-mono text-xs tabular-nums rounded-md bg-slate-800 px-2 py-0.5 text-slate-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Educational Disclaimer Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-[11px] leading-relaxed text-slate-400">
                <strong className="text-slate-300">Educational Tool:</strong> Not a trading platform. Does not provide personalized financial advice.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
