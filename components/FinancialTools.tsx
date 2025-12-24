import React, { useState, useMemo, useRef } from 'react';
import { Calculator, TrendingUp, ArrowLeft, Info, Plus, Minus, RotateCcw, PieChart, Coins, Trash2, Percent, Users, ChevronRight, Zap, Target } from 'lucide-react';

interface StockRow {
  id: string;
  price: number | string;
  qty: number | string;
}

const FinancialTools: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTool, setActiveTool] = useState<'sip' | 'average' | 'probability'>('sip');

  // SIP Calculator State
  const [monthlyInvest, setMonthlyInvest] = useState(25000);
  const [lumpsum, setLumpsum] = useState(0);
  const [returnRate, setReturnRate] = useState(12);
  const [period, setPeriod] = useState(10);

  // Stock Average State
  const [stockRows, setStockRows] = useState<StockRow[]>([
    { id: '1', price: 100, qty: 10 },
    { id: '2', price: 80, qty: 10 }
  ]);

  // Allotment Probability State
  const [offeredShares, setOfferedShares] = useState<number | string>(100000);
  const [appliedShares, setAppliedShares] = useState<number | string>(500000);

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
    
    // Lumpsum Formula: FV = P × (1 + i)^n
    const annualRate = (returnRate || 0) / 100;
    const lumpsumFutureValue = lumpsum > 0 
      ? lumpsum * Math.pow(1 + annualRate, period || 0) 
      : 0;
    
    const totalFutureValue = Math.round(sipFutureValue + lumpsumFutureValue);
    const totalInvested = Math.round((P * n) + lumpsum);
    const totalGains = totalFutureValue - totalInvested;
    
    const gainRatio = totalFutureValue > 0 ? (totalGains / totalFutureValue) * 100 : 0;
    
    return {
      invested: totalInvested,
      gains: totalGains,
      total: totalFutureValue,
      gainRatio
    };
  }, [monthlyInvest, lumpsum, returnRate, period]);

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
   * Smart Terminal Input Component
   * Optimized for native mobile keyboards and high-speed desktop entry
   */
  const SmartNumericInput = ({ 
    label, 
    value, 
    onChange, 
    showWords = true,
    quickAddOptions = []
  }: { 
    label: string, 
    value: number, 
    onChange: (val: number) => void, 
    showWords?: boolean,
    quickAddOptions?: { label: string, value: number }[]
  }) => {
    const isPeriod = label.toLowerCase().includes('period');
    const isRate = label.toLowerCase().includes('rate');
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">{label}</label>
          {quickAddOptions.length > 0 && (
            <div className="flex gap-1.5">
              {quickAddOptions.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => onChange(value + opt.value)}
                  className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  +{opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative group flex items-center gap-3">
          <div className="flex-1 relative">
            <input 
              type="text" 
              inputMode="decimal"
              pattern="[0-9]*"
              value={value === 0 ? "" : value}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                onChange(val === "" ? 0 : Number(val));
              }}
              onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
              placeholder="0"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 pl-6 rounded-3xl font-black text-3xl dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 shadow-sm transition-all caret-emerald-500"
            />
            {/* Visual Overlay Label: Shows formatted value so user sees commas while typing in the raw box */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-right">
              <span className="text-sm font-black text-emerald-500/50 uppercase tracking-widest bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                {isRate ? `${value}%` : isPeriod ? `${value} yrs` : `₹${formatINR(value)}`}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => onChange(value + (isPeriod || isRate ? 1 : 5000))} 
              className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-90"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
            <button 
              onClick={() => onChange(Math.max(0, value - (isPeriod || isRate ? 1 : 5000)))} 
              className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all active:scale-90"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        {showWords && value > 0 && !isRate && !isPeriod && (
          <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-left-2">
            <Zap size={10} className="text-emerald-500 fill-emerald-500" />
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              {numToWords(value)}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-20">
        <header className="mb-12 space-y-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-600 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-emerald-500/20 shadow-xl w-fit"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-2">
              <h2 className="text-6xl sm:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Terminal Tools</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-xl max-w-xl">
                High-precision financial intelligence for elite portfolio planning.
              </p>
            </div>

            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTool('sip')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTool === 'sip' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>SIP Planner</button>
              <button onClick={() => setActiveTool('average')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTool === 'average' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Stock Average</button>
              <button onClick={() => setActiveTool('probability')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTool === 'probability' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Allotment Prob.</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-start">
          {/* Inputs Section */}
          <div className="space-y-10 order-2 lg:order-1 animate-fade-in-up">
            {activeTool === 'sip' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12">
                <SmartNumericInput 
                  label="Monthly SIP Amount" 
                  value={monthlyInvest} 
                  onChange={setMonthlyInvest} 
                  quickAddOptions={[
                    { label: "5k", value: 5000 },
                    { label: "10k", value: 10000 },
                    { label: "50k", value: 50000 }
                  ]}
                />
                
                <SmartNumericInput 
                  label="One-time Lumpsum" 
                  value={lumpsum} 
                  onChange={setLumpsum} 
                  quickAddOptions={[
                    { label: "1L", value: 100000 },
                    { label: "5L", value: 500000 },
                    { label: "10L", value: 1000000 }
                  ]}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <SmartNumericInput 
                    label="Return Rate (% p.a.)" 
                    value={returnRate} 
                    onChange={setReturnRate} 
                    showWords={false} 
                  />
                  <SmartNumericInput 
                    label="Time Period (Years)" 
                    value={period} 
                    onChange={setPeriod} 
                    showWords={false} 
                    quickAddOptions={[
                      { label: "1yr", value: 1 },
                      { label: "3yr", value: 3 },
                      { label: "5yr", value: 5 }
                    ]}
                  />
                </div>
              </div>
            )}

            {activeTool === 'average' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Batches</p>
                  <button onClick={() => setStockRows([...stockRows, { id: Date.now().toString(), price: '', qty: '' }])} className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <Plus size={14} strokeWidth={3} /> Add Batch
                  </button>
                </div>
                <div className="space-y-4">
                  {stockRows.map(row => (
                    <div key={row.id} className="grid grid-cols-12 gap-4 items-end p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-emerald-500/30 transition-all">
                      <div className="col-span-5 space-y-2">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Price</label>
                        <input 
                          type="text" 
                          inputMode="decimal"
                          pattern="[0-9]*"
                          value={row.price} 
                          onChange={(e) => setStockRows(stockRows.map(r => r.id === row.id ? { ...r, price: e.target.value.replace(/[^0-9.]/g, '') } : r))} 
                          onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
                          placeholder="0.00" 
                          className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl font-black text-sm border border-transparent focus:border-emerald-500 outline-none" 
                        />
                      </div>
                      <div className="col-span-5 space-y-2">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Quantity</label>
                        <input 
                          type="text" 
                          inputMode="decimal"
                          pattern="[0-9]*"
                          value={row.qty} 
                          onChange={(e) => setStockRows(stockRows.map(r => r.id === row.id ? { ...r, qty: e.target.value.replace(/[^0-9.]/g, '') } : r))} 
                          onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
                          placeholder="0" 
                          className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl font-black text-sm border border-transparent focus:border-emerald-500 outline-none" 
                        />
                      </div>
                      <button onClick={() => setStockRows(stockRows.filter(r => r.id !== row.id))} className="col-span-2 p-4 text-rose-500 hover:bg-rose-50 rounded-xl flex justify-center"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTool === 'probability' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12">
                <SmartNumericInput label="Total Shares Offered" value={Number(offeredShares)} onChange={(v) => setOfferedShares(v)} />
                <SmartNumericInput label="Total Shares Applied" value={Number(appliedShares)} onChange={(v) => setAppliedShares(v)} />
              </div>
            )}
          </div>

          {/* Result Card Section */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-32">
            <div className="bg-slate-900 text-white p-8 sm:p-16 rounded-[3rem] sm:rounded-[4.5rem] shadow-2xl relative overflow-hidden group border border-slate-800 flex flex-col min-h-[500px]">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000 rotate-12 group-hover:rotate-0">
                {activeTool === 'sip' ? <TrendingUp size={400} /> : activeTool === 'average' ? <Calculator size={400} /> : <Percent size={400} />}
              </div>

              <div className="relative z-10 flex flex-col h-full flex-1">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-8">
                    Market Analytics Engine
                  </div>
                  <h3 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9]">
                    {activeTool === 'sip' ? 'Future Wealth Potential' : activeTool === 'average' ? 'Weighted Cost Average' : 'Likely Allotment Odds'}
                  </h3>
                </div>

                {activeTool === 'sip' && (
                  <div className="flex flex-col sm:flex-row gap-12 items-center mb-16">
                    {/* Donut Chart SVG */}
                    <div className="relative w-48 h-48 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-800" />
                        <circle 
                          cx="50" cy="50" r="42" fill="transparent" 
                          stroke="currentColor" strokeWidth="12" 
                          strokeDasharray={`${sipResults.gainRatio * 2.63} 263.89`}
                          className="text-emerald-500 transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black">{Math.round(sipResults.gainRatio)}%</span>
                        <span className="text-[9px] font-black uppercase text-slate-500">Wealth Ratio</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Invested Capital</span>
                        <span className="text-xl font-black">₹{formatINR(sipResults.invested)}</span>
                      </div>
                      <div className="flex justify-between items-center p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 shadow-inner">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Estimated Returns</span>
                        <span className="text-xl font-black text-emerald-400">₹{formatINR(sipResults.gains)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-auto">
                  <div className="p-10 sm:p-14 bg-white/5 border border-white/10 rounded-[2.5rem] sm:rounded-[3.5rem] backdrop-blur-xl shadow-2xl">
                     <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                       {activeTool === 'sip' ? 'Est. Maturity Amount' : activeTool === 'average' ? 'Net Weighted Price' : 'Statistical Probability'}
                     </p>
                     <div className="w-full">
                        <p className="text-4xl sm:text-7xl font-black text-emerald-400 tracking-tighter leading-none mb-4 break-words">
                          {activeTool === 'sip' 
                              ? `₹${formatINR(sipResults.total)}` 
                              : activeTool === 'average' 
                                ? `₹${formatINR(avgResults.avgPrice, 2)}`
                                : `${probResults.toFixed(2)}%`
                            }
                        </p>
                     </div>
                     {(activeTool === 'sip' || activeTool === 'average') && (
                       <div className="flex items-center gap-2 opacity-50">
                         <Zap size={12} className="text-emerald-500" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                           {numToWords(activeTool === 'sip' ? sipResults.total : Math.round(avgResults.totalCost))}
                         </p>
                       </div>
                     )}
                  </div>
                  
                  <div className="mt-10 flex items-start gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                    <div className="p-2.5 bg-slate-800 rounded-xl shrink-0 shadow-lg">
                      <Info size={16} className="text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-[0.1em]">
                      {activeTool === 'sip' 
                        ? "Wealth projections based on compound interest logic. Professional models assume ideal conditions."
                        : activeTool === 'average'
                          ? "Inventory cost calculated as (Σ Price × Qty) / Σ Qty. Taxes and slippage not included."
                          : "Odds calculated from public subscription data. Real allotment is governed by random algorithms."}
                    </p>
                  </div>
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