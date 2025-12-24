
import React, { useState, useEffect, useCallback } from 'react';
import { TICKER_DATA } from '../constants';
import { TickerItem } from '../types';

const TickerTape: React.FC = () => {
  const [marketData, setMarketData] = useState<TickerItem[]>(TICKER_DATA);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMarketPrices = useCallback(async () => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedData = marketData.map(item => {
        if (item.label === 'NIFTY 50' || item.label === 'SENSEX') {
          const currentVal = parseFloat(item.value.replace(/,/g, ''));
          const variance = (Math.random() - 0.5) * 60;
          const newVal = currentVal + variance;
          const changePct = ((variance / currentVal) * 100).toFixed(2);
          
          return {
            ...item,
            value: newVal.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
            change: (variance >= 0 ? '+' : '') + changePct + '%',
            trend: (variance >= 0 ? 'up' : 'down') as 'up' | 'down'
          };
        }
        return item;
      });

      setMarketData(updatedData);
    } catch (error) {
      console.error("Ticker update error:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [marketData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketPrices();
    }, 45000);
    return () => clearInterval(interval);
  }, [fetchMarketPrices]);

  const displayItems = [...marketData, ...marketData, ...marketData];

  return (
    <div className="w-full h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/50 flex items-center overflow-hidden transition-all duration-300 relative z-30">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex items-center gap-2 pl-4 z-20 bg-white dark:bg-slate-900 pr-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isUpdating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
      </div>

      <div className="animate-ticker flex whitespace-nowrap items-center">
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center px-8 gap-3 border-r border-slate-100 dark:border-slate-800/50 last:border-r-0">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {item.label}
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {item.value}
            </span>
            <span className={`text-[10px] font-black flex items-center gap-0.5 ${
              item.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
            }`}>
              {item.trend === 'up' ? '▲' : '▼'}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerTape;
