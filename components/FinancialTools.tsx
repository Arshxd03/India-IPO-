import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ArrowLeft, 
  Info, 
  Plus, 
  Minus, 
  Trash2, 
  Zap, 
  Percent, 
  PieChart as ChartIcon, 
  Clipboard,
  Wallet,
  Calendar,
  IndianRupee,
  Activity,
  ChevronRight
} from 'lucide-react';

interface StockRow {
  id: string;
  price: number | string;
  qty: number | string;
}

const FinancialTools: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTool, setActiveTool] = useState<'sip' | 'average' | 'probability'>('sip');

  // SIP Calculator State
  const [monthlyInvest, setMonthlyInvest] = useState(25000);
  const [returnRate, setReturnRate] = useState(12);
  const [period, setPeriod] = useState(10);

  // Stock Average State
  const [stockRows, setStockRows] = useState<StockRow[]>([
    { id: '1', price: 100, qty: 10 },
    { id: '2', price: 80, qty: 10 }
  ]);

  // Allotment Probability State
  const [offeredShares, setOfferedShares] = useState<number>(100000);
  const [appliedShares, setAppliedShares] = useState<number>(5000000);

  const formatINR = (val: number, fractionDigits: number = 0) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: 0
    }).format(val);
  };

  const numToWords = (num: number) => {
    if (num === 0) return "";
    if (num < 1000) return num.toString();
    if (num < 100000) return (num / 1000).toFixed(2).replace(/\.00$/, '') + " Thousand";
    if (num < 10000000) return (num / 100000).toFixed(2).replace(/\.00$/, '') + " Lakhs";
    return (num / 10000000).toFixed(2).replace(/\.00$/, '') + " Crores";
  };

  const sipResults = useMemo(() => {
    const P = monthlyInvest;
    const i = (returnRate || 0) / 12 / 100;
    const n = (period || 0) * 12;
    
    // SIP Formula (Annuity Due): FV = P × [((1 + i)^n - 1) / i] × (1 + i)
    const sipFutureValue = P > 0 && i > 0 
      ? P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) 
      : P * n;
    
    const totalFutureValue = Math.round(sipFutureValue);
    const totalInvested = Math.round(P * n);
    const totalGains = totalFutureValue - totalInvested;
    
    const gainRatio = totalFutureValue > 0 ? (totalGains / totalFutureValue) * 100 : 0;
    const investRatio = totalFutureValue > 0 ? (totalInvested / totalFutureValue) * 100 : 0;
    
    return {
      invested: totalInvested,
      gains: totalGains,
      total: totalFutureValue,
      gainRatio,
      investRatio
    };
  }, [monthlyInvest, returnRate, period]);

  const avgResults = useMemo(() => {
    let totalCost = 0;
    let totalQty = 0;
    stockRows.forEach(row => {
      const p = Number(row.price) || 0;
      const q = Number(row.qty) || 0;
      totalCost += (p * q);
      totalQty += q;
    });
    const avgPrice = totalQty > 0 ? totalCost / totalQty : 0;
    return { totalCost, totalQty, avgPrice };
  }, [stockRows]);

  const probResults = useMemo(() => {
    const offered = Number(offeredShares) || 0;
    const applied = Number(appliedShares) || 0;
    if (applied === 0) return 0;
    return Math.min(100, (offered / applied) * 100);
  }, [offeredShares, appliedShares]);

  /**
   * Unified Numeric Input Component
   * Matches the visual language of professional trading terminals
   */
  const NumericTerminalInput = ({ 
    label, 
    value, 
    onChange, 
    icon: Icon,
    isCurrency = false,
    placeholder = "0",
    isPercent = false
  }: { 
    label: string, 
    value: number, 
    onChange: (val: number) => void,
    icon: React.ElementType,
    isCurrency?: boolean,
    isPercent?: boolean,
    placeholder?: string
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      const num = raw === "" ? 0 : Number(raw);
      if (num <= 1000000000) onChange(num);
    };

    return (
      <div className="space-y-4 w-full">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
          <Icon size={12} className="text-blue-500" />
          {label}
        </label>
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors pointer-events-none">
            {isCurrency ? <IndianRupee size={20} strokeWidth={3} /> : isPercent ? <Percent size={20} strokeWidth={3} /> : <Zap size={20} strokeWidth={3} />}
          </div>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={isFocused ? (value === 0 ? "" : value) : (isCurrency ? formatINR(value) : value)}
            onChange={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
            placeholder={placeholder}
            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 p-8 pl-16 rounded-[2.5rem] font-black text-3xl sm:text-4xl dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
          />
        </div>
        {value > 0 && isCurrency && (
          <div className="flex items-center gap-2 px-4 animate-in fade-in slide-in-from-left-2">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
              {numToWords(value)}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-20">
        <header className="mb-12 space-y-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-600 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 shadow-xl w-fit"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Back to Tracker
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-2">
              <h2 className="text-6xl sm:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">FinTools</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-xl max-w-xl">
                The terminal for data-driven Indian market insights.
              </p>
            </div>

            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTool('sip')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTool === 'sip' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>SIP Planner</button>
              <button onClick={() => setActiveTool('average')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTool === 'average' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Stock Average</button>
              <button onClick={() => setActiveTool('probability')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTool === 'probability' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Allotment Odds</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-start">
          {/* Inputs Column */}
          <div className="space-y-10 order-2 lg:order-1 animate-fade-in-up">
            {activeTool === 'sip' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-14 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12">
                <NumericTerminalInput 
                  label="Monthly SIP Amount" 
                  value={monthlyInvest} 
                  onChange={setMonthlyInvest} 
                  icon={Wallet} 
                  isCurrency 
                />
                
                <NumericTerminalInput 
                  label="Expected Return Rate (p.a)" 
                  value={returnRate} 
                  onChange={setReturnRate} 
                  icon={TrendingUp} 
                  isPercent 
                />

                <NumericTerminalInput 
                  label="Time Period (Years)" 
                  value={period} 
                  onChange={setPeriod} 
                  icon={Calendar} 
                />
              </div>
            )}

            {activeTool === 'average' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-14 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Batches</p>
                  <button onClick={() => setStockRows([...stockRows, { id: Date.now().toString(), price: '', qty: '' }])} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all">
                    <Plus size={14} strokeWidth={3} /> Add Batch
                  </button>
                </div>
                <div className="space-y-4">
                  {stockRows.map(row => (
                    <div key={row.id} className="grid grid-cols-12 gap-4 items-center p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-blue-500/30 transition-all">
                      <div className="col-span-5 space-y-2">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Price</label>
                        <input 
                          type="text" 
                          inputMode="decimal"
                          value={row.price} 
                          onChange={(e) => setStockRows(stockRows.map(r => r.id === row.id ? { ...r, price: e.target.value.replace(/[^0-9.]/g, '') } : r))} 
                          onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
                          placeholder="₹0.00" 
                          className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl font-black text-xl border-2 border-transparent focus:border-blue-500 outline-none shadow-sm dark:text-white" 
                        />
                      </div>
                      <div className="col-span-5 space-y-2">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Quantity</label>
                        <input 
                          type="text" 
                          inputMode="decimal"
                          value={row.qty} 
                          onChange={(e) => setStockRows(stockRows.map(r => r.id === row.id ? { ...r, qty: e.target.value.replace(/[^0-9.]/g, '') } : r))} 
                          onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
                          placeholder="0" 
                          className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl font-black text-xl border-2 border-transparent focus:border-blue-500 outline-none shadow-sm dark:text-white" 
                        />
                      </div>
                      <div className="col-span-2 flex justify-center pt-5">
                        <button onClick={() => setStockRows(stockRows.filter(r => r.id !== row.id))} className="p-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"><Trash2 size={24} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTool === 'probability' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-14 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12">
                <NumericTerminalInput 
                  label="Total Shares Offered" 
                  value={offeredShares} 
                  onChange={setOfferedShares} 
                  icon={Activity}
                  placeholder="Ex: 1,00,000"
                />
                <NumericTerminalInput 
                  label="Total Shares Applied" 
                  value={appliedShares} 
                  onChange={setAppliedShares} 
                  icon={ChartIcon}
                  placeholder="Ex: 50,00,000"
                />
              </div>
            )}
          </div>

          {/* Results Column */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-32">
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[600px] border border-slate-100 dark:border-slate-800">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.05] rotate-12 pointer-events-none">
                <TrendingUp size={450} />
              </div>

              <div className="relative z-10 flex flex-col h-full flex-1">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-8">
                    <ChartIcon size={12} /> Live Valuation
                  </div>
                  <h3 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                    {activeTool === 'sip' ? 'Future Wealth' : activeTool === 'average' ? 'Unit Cost' : 'Success Odds'}
                  </h3>
                </div>

                {activeTool === 'sip' && (
                  <div className="flex flex-col gap-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[3rem] border border-slate-100 dark:border-slate-800/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Invested Capital</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">₹{formatINR(sipResults.invested)}</p>
                      </div>
                      <div className="p-8 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Est. Gains</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{formatINR(sipResults.gains)}</p>
                      </div>
                    </div>

                    <div className="p-12 bg-blue-600 text-white rounded-[3.5rem] shadow-2xl shadow-blue-600/20 animate-in zoom-in duration-500">
                       <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-100 mb-4 opacity-70">
                         Maturity Value
                       </p>
                       <p className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-4 break-all">
                         ₹{formatINR(sipResults.total)}
                       </p>
                       <div className="flex items-center gap-2">
                         <Zap size={14} className="text-blue-200 fill-blue-200" />
                         <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] truncate">
                           {numToWords(sipResults.total)}
                         </p>
                       </div>
                    </div>
                  </div>
                )}

                {activeTool !== 'sip' && (
                  <div className="mt-auto space-y-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                {activeTool === 'average' ? 'Total Units' : 'Total Offered'}
                            </p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                {activeTool === 'average' ? avgResults.totalQty : formatINR(Number(offeredShares))}
                            </p>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                {activeTool === 'average' ? 'Total Cost' : 'Total Applied'}
                            </p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                {activeTool === 'average' ? '₹' + formatINR(avgResults.totalCost) : formatINR(Number(appliedShares))}
                            </p>
                        </div>
                    </div>
                    <div className="p-12 bg-blue-600 text-white rounded-[3.5rem] shadow-2xl shadow-blue-600/20">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-100 mb-4 opacity-70">
                            {activeTool === 'average' ? 'Weighted Price' : 'Statistical Probability'}
                        </p>
                        <p className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-4 break-all">
                            {activeTool === 'average' ? `₹${formatINR(avgResults.avgPrice, 2)}` : `${probResults.toFixed(2)}%`}
                        </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-12 flex items-start gap-4 p-8 bg-slate-50 dark:bg-slate-950/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shrink-0 shadow-lg">
                    <Info size={18} className="text-blue-500" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed uppercase tracking-[0.15em]">
                    Terminal projections are computed using standard mathematical models. Actual financial outcomes are subject to market risks, taxes, and bank processing fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialTools;