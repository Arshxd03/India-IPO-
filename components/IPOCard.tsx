
import React, { useState, useEffect } from 'react';
import { IPO, InvestmentDetails } from '../types';
import { getIPOInsight, fetchDetailedListingAnalysis } from '../services/geminiService';
import { 
  TrendingUp, TrendingDown, Calendar, Activity, CheckCircle2, 
  Sparkles, Calculator, Heart, ExternalLink, Link2, Zap, 
  Users2, SearchCode, ArrowUpRight, TrendingUp as GainIcon,
  ChevronDown, ChevronUp, Loader2, Info
} from 'lucide-react';

interface IPOCardProps {
  ipo: IPO;
  onCheckInvestment: (details: InvestmentDetails) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const IPOCard: React.FC<IPOCardProps> = ({ ipo, onCheckInvestment, isFavorite, onToggleFavorite }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
  // Expansion Logic
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState<string | null>(null);
  const [isDeepLoading, setIsDeepLoading] = useState(false);
  const [deepError, setDeepError] = useState<string | null>(null);

  if (!ipo) return null;

  const isListed = ipo.status === 'Listed';

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    const priceString = ipo.priceBand || "0";
    const prices = priceString.replace(/[₹\s,]/g, '').split(/[–-]/);
    const min = parseInt(prices[0]) || 0;
    const max = prices.length > 1 ? parseInt(prices[1]) : min;
    
    onCheckInvestment({
      companyName: ipo.name || "Unknown Company",
      lotSize: ipo.lotSize || 0,
      minPrice: min,
      maxPrice: max
    });
  };

  const handleFetchInsight = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (insight) { setInsight(null); return; }
    setIsLoadingInsight(true);
    const result = await getIPOInsight(ipo);
    setInsight(result);
    setIsLoadingInsight(false);
  };

  const toggleExpansion = async () => {
    if (!isListed) return; // Only Recently Listed cards are expandable
    
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    if (nextState && !detailedAnalysis) {
      const cacheKey = `analysis_data_${ipo.name}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        setDetailedAnalysis(cached);
      } else {
        setIsDeepLoading(true);
        setDeepError(null);
        try {
          const result = await fetchDetailedListingAnalysis(ipo.name, ipo.sector || 'General');
          setDetailedAnalysis(result);
          localStorage.setItem(cacheKey, result);
        } catch (error: any) {
          if (error.message === "QUOTA_EXCEEDED") {
            setDeepError("Deep analysis currently offline. Please check back later!");
          } else {
            setDeepError("Failed to fetch detailed analysis. Market data link interrupted.");
          }
        } finally {
          setIsDeepLoading(false);
        }
      }
    }
  };

  return (
    <div 
      onClick={toggleExpansion}
      className={`bg-white dark:bg-[#0f172a] p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 flex flex-col shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden ${isListed ? 'cursor-pointer' : ''} ${isExpanded ? 'ring-2 ring-indigo-500/20' : ''}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
              ipo.type === 'Mainboard' 
                ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800' 
                : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800'
            }`}>
              {ipo.type}
            </span>
            <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-900 text-slate-500 text-[8px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 rounded-lg">
              {ipo.sector}
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
            {ipo.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(ipo.id); }}
            className={`p-3 rounded-2xl transition-all ${isFavorite ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-rose-500'}`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
          </button>
          {isListed && (
            <div className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          )}
        </div>
      </div>

      {!isListed ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 flex items-center gap-3">
              <Zap size={16} className="text-emerald-500" />
              <div>
                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">GMP</p>
                <p className="text-base font-black text-slate-900 dark:text-white">₹{ipo.gmp}</p>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30 flex items-center gap-3">
              <Users2 size={16} className="text-indigo-500" />
              <div>
                <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Subscription</p>
                <p className="text-base font-black text-slate-900 dark:text-white">{ipo.subscription}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lot Size</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{ipo.lotSize} Shares</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Price</p>
                <p className="text-lg font-black text-slate-900 dark:text-white truncate">{ipo.priceBand}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4 mb-8">
           <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] ${
                ipo.returns! >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {ipo.returns! > 20 ? 'Wealth Creator' : ipo.returns! < 0 ? 'Wealth Destroyer' : 'Stable List'}
              </span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-auto flex items-center gap-1">
                {isExpanded ? 'Click to minimize' : 'Click to expand'}
              </span>
           </div>
           <div className="p-6 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <ArrowUpRight size={80} className="absolute right-[-10%] top-[-20%] opacity-10" />
             <div className="flex justify-between items-end relative z-10">
               <div>
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Current Price</p>
                 <p className="text-3xl font-black">₹{ipo.currentPrice?.toLocaleString('en-IN')}</p>
               </div>
               <div className="text-right">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Return</p>
                 <p className="text-2xl font-black flex items-center justify-end gap-1">
                   {ipo.returns! >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                   {ipo.returns}%
                 </p>
               </div>
             </div>
           </div>
           
           {/* Accordion Content */}
           <div className={`transition-all duration-700 overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100 pt-4' : 'max-h-0 opacity-0'}`}>
             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6">
                {isDeepLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consulting AI Terminal...</p>
                  </div>
                ) : deepError ? (
                  <div className="flex items-start gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <Info className="text-amber-500 shrink-0" size={18} />
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{deepError}</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Business Overview</p>
                      <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                        {detailedAnalysis?.split('\n')[0] || detailedAnalysis}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Post-Listing Analysis</p>
                      <div className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
                        {detailedAnalysis?.includes('Post-Listing Analysis') ? 
                          detailedAnalysis.split('Post-Listing Analysis')[1].trim() : 
                          detailedAnalysis?.split('\n').slice(1).join('\n').trim()}
                      </div>
                    </div>
                  </div>
                )}
             </div>
           </div>

           {!isExpanded && (
             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Issue</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">₹{ipo.issuePrice}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Listed</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">₹{ipo.listingPrice}</p>
                </div>
             </div>
           )}
        </div>
      )}

      <div className="mt-auto flex gap-3">
        {ipo.status === 'Open' ? (
          <button onClick={handleCheck} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
            Invest Now
          </button>
        ) : (
          <a onClick={e => e.stopPropagation()} href="https://www.chittorgarh.com/" target="_blank" className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
            Details <ExternalLink size={12} />
          </a>
        )}
        <button onClick={handleFetchInsight} className={`flex-1 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-indigo-500 transition-all ${isLoadingInsight ? 'opacity-50' : ''}`}>
          <Sparkles size={12} className="text-indigo-500" /> Insight
        </button>
      </div>

      {insight && (
        <div className="mt-6 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 animate-in fade-in slide-in-from-top-2">
           <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">"{insight}"</p>
        </div>
      )}
    </div>
  );
};

export default IPOCard;
