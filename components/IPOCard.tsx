
import React, { useState } from 'react';
import { IPO, InvestmentDetails } from '../types';
import { getIPOInsight } from '../services/geminiService';
import { TrendingUp, Calendar, Activity, CheckCircle2, AlertCircle, Sparkles, Calculator, BarChart3, Heart, ExternalLink, Link2 } from 'lucide-react';

interface IPOCardProps {
  ipo: IPO;
  onCheckInvestment: (details: InvestmentDetails) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const IPOCard: React.FC<IPOCardProps> = ({ ipo, onCheckInvestment, isFavorite, onToggleFavorite }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const parseCurrency = (val: string | undefined) => {
    if (!val) return 0;
    return parseFloat(val.replace(/[₹\s,]/g, ''));
  };

  const handleCheck = () => {
    const prices = ipo.priceBand.replace(/[₹\s,]/g, '').split(/[–-]/);
    const min = parseInt(prices[0]);
    const max = prices.length > 1 ? parseInt(prices[1]) : min;
    
    onCheckInvestment({
      companyName: ipo.name,
      lotSize: ipo.lotSize,
      minPrice: min,
      maxPrice: max
    });
  };

  const handleFetchInsight = async () => {
    if (insight) {
      setInsight(null);
      return;
    }
    setIsLoadingInsight(true);
    const result = await getIPOInsight(ipo);
    setInsight(result);
    setIsLoadingInsight(false);
  };

  const basePrice = ipo.priceBand.includes('–') || ipo.priceBand.includes('-')
    ? parseCurrency(ipo.priceBand.split(/[–-]/)[1]) 
    : parseCurrency(ipo.priceBand);
  
  const estimatedListing = basePrice + ipo.gmp;
  const gainPercentage = basePrice > 0 ? ((ipo.gmp / basePrice) * 100).toFixed(1) : "0";
  const isPositiveGain = ipo.gmp > 0;

  const StatusBadge = () => {
    switch(ipo.status) {
      case 'Open':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
            <Activity size={12} strokeWidth={3} className="animate-pulse" />
            LIVE
          </div>
        );
      case 'Upcoming':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20 text-[10px] font-black uppercase tracking-widest">
            <Calendar size={12} strokeWidth={3} />
            Upcoming
          </div>
        );
      case 'Closed':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={12} strokeWidth={3} />
            Closed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-[#1e293b] p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-300 transform hover:-translate-y-1 group hover:shadow-2xl`}>
      <div className="flex justify-between items-start mb-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              ipo.type === 'Mainboard' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800' : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800'
            }`}>
              {ipo.type}
            </span>
            {ipo.sector && (
              <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                {ipo.sector}
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-emerald-500 transition-colors">
            {ipo.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(ipo.id); }}
            className={`p-2 rounded-xl transition-all ${isFavorite ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 2.5} />
          </button>
          <StatusBadge />
        </div>
      </div>

      <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">
              Est. Listing Price
            </p>
            <p className="text-xl font-black text-slate-900 dark:text-white">₹{estimatedListing.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">
              Expected Gain
            </p>
            <p className={`text-sm font-black flex items-center justify-end gap-1 ${isPositiveGain ? 'text-emerald-500' : 'text-slate-500'}`}>
              {isPositiveGain && <TrendingUp size={14} />}
              {gainPercentage}% (₹{ipo.gmp})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50 dark:border-slate-800/50 mb-4">
        <div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
            <BarChart3 size={10} /> Price Band
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ipo.priceBand}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Lot Size</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ipo.lotSize} Shares</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Subscription</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ipo.subscription || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          {ipo.status !== 'Closed' && (
             <button 
                onClick={handleCheck}
                className="w-full sm:flex-1 py-3 px-4 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-colors shadow-sm flex items-center justify-center gap-2"
             >
               <Calculator size={14} /> Calculate
             </button>
          )}
          <button 
            onClick={handleFetchInsight}
            disabled={isLoadingInsight}
            className={`w-full sm:flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500`}
          >
            {isLoadingInsight ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
            ) : (
              <><Sparkles size={14} /> Analyze</>
            )}
          </button>
        </div>

        {insight && (
          <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
             <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{insight}</p>
          </div>
        )}

        {ipo.groundingSources && (
          <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 mb-2">
              <Link2 size={12} className="text-slate-400" />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Grounding Sources</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ipo.groundingSources.slice(0, 2).map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[9px] font-bold text-emerald-500 hover:underline flex items-center gap-1 max-w-full truncate"
                >
                  <ExternalLink size={10} /> {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPOCard;
