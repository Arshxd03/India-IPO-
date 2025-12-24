
import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, ArrowLeft, Info, Plus, RotateCcw, PieChart, Coins, Trash2, Percent, Users } from 'lucide-react';

interface StockRow {
  id: string;
  price: number | string;
  qty: number | string;
}

const FinancialTools: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTool, setActiveTool] = useState<'sip' | 'average' | 'probability'>('sip');

  // SIP Calculator State
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [period, setPeriod] = useState(10);

  // Stock Average State (Multiple Rows)
  const [stockRows, setStockRows] = useState<StockRow[]>([
    { id: '1', price: 100, qty: 10 },
    { id: '2', price: 80, qty: 10 }
  ]);

  // Allotment Probability State
  const [offeredShares, setOfferedShares] = useState<number | string>(100000);
  const [appliedShares, setAppliedShares] = useState<number | string>(500000);

  const sipResults = useMemo(() => {
    const P = monthlyInvest;
    const i = returnRate / 12 / 100;
    const n = period * 12;
    
    // Formula: FV = P × ({[1 + i]^n - 1} / i) × (1 + i)
    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    const gains = futureValue - invested;
    
    return {
      invested: Math.round(invested),
      gains: Math.round(gains),
      total: Math.round(futureValue)
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

    return {
      totalCost,
      totalQty,
      avgPrice
    };
  }, [stockRows]);

  const probResults = useMemo(() => {
    const offered = Number(offeredShares) || 0;
    const applied = Number(appliedShares) || 0;
    
    if (applied === 0) return 0;
    const prob = (offered / applied) * 100;
    return Math.min(100, prob);
  }, [offeredShares, appliedShares]);

  const addStockRow = () => {
    setStockRows([...stockRows, { id: Date.now().toString(), price: '', qty: '' }]);
  };

  const removeStockRow = (id: string) => {
    if (stockRows.length > 1) {
      setStockRows(stockRows.filter(row => row.id !== id));
    }
  };

  const updateStockRow = (id: string, field: 'price' | 'qty', value: string) => {
    setStockRows(stockRows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <header className="mb-12 space-y-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-600 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20 shadow-lg w-fit"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Terminal Tools</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-xl max-w-xl">
                Advanced financial math for intelligent decision making.
              </p>
            </div>

            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTool('sip')}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTool === 'sip' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                SIP
              </button>
              <button 
                onClick={() => setActiveTool('average')}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTool === 'average' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Stock Average
              </button>
              <button 
                onClick={() => setActiveTool('probability')}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTool === 'probability' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Allotment Prob
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in-up">
          {/* Tool Inputs */}
          <div className="lg:col-span-5 space-y-8 h-fit">
            {activeTool === 'sip' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
                <div className="space-y-4">
                  <label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Monthly Investment <span>₹{monthlyInvest.toLocaleString('en-IN')}</span>
                  </label>
                  <input 
                    type="range" min="500" max="100000" step="500" value={monthlyInvest}
                    onChange={(e) => setMonthlyInvest(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Expected Return Rate <span>{returnRate}% p.a.</span>
                  </label>
                  <input 
                    type="range" min="1" max="30" step="0.5" value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Time Period <span>{period} Years</span>
                  </label>
                  <input 
                    type="range" min="1" max="40" step="1" value={period}
                    onChange={(e) => setPeriod(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            )}

            {activeTool === 'average' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 max-h-[600px] overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trading Batches</p>
                  <button 
                    onClick={addStockRow}
                    className="text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus size={14} /> Add Batch
                  </button>
                </div>
                
                {stockRows.map((row, index) => (
                  <div key={row.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="col-span-5 space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block ml-1">Price</label>
                      <input 
                        type="number" value={row.price} onChange={(e) => updateStockRow(row.id, 'price', e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl font-bold dark:text-white focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                    <div className="col-span-5 space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block ml-1">Quantity</label>
                      <input 
                        type="number" value={row.qty} onChange={(e) => updateStockRow(row.id, 'qty', e.target.value)}
                        placeholder="0"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl font-bold dark:text-white focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                    <div className="col-span-2 pb-1 text-center">
                      <button 
                        onClick={() => removeStockRow(row.id)}
                        disabled={stockRows.length <= 1}
                        className={`p-2 rounded-lg transition-all ${stockRows.length <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => setStockRows([{ id: '1', price: '', qty: '' }, { id: '2', price: '', qty: '' }])}
                  className="w-full py-4 border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={14} /> Clear All Batches
                </button>
              </div>
            )}

            {activeTool === 'probability' && (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-2">Total Shares Offered (Issue Size)</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number" value={offeredShares} onChange={(e) => setOfferedShares(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 pl-12 rounded-[1.5rem] font-bold dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-2">Total Shares Applied (Subscription)</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number" value={appliedShares} onChange={(e) => setAppliedShares(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 pl-12 rounded-[1.5rem] font-bold dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                   <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Info size={14} /> Market Insight
                   </p>
                   <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
                     Probabilities higher than 100% indicate under-subscription, meaning allotment is guaranteed. Note: Actual allotment follows SEBI's proportional or lottery methodology depending on category.
                   </p>
                </div>
              </div>
            )}
          </div>

          {/* Result Display */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 text-white p-10 sm:p-16 rounded-[4rem] h-full shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                {activeTool === 'sip' ? <TrendingUp size={240} /> : activeTool === 'average' ? <Calculator size={240} /> : <Percent size={240} />}
              </div>

              <div className="relative z-10 flex flex-col h-full flex-grow">
                <div className="mb-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-4">Live Analytics</p>
                  <h3 className="text-4xl sm:text-7xl font-black tracking-tighter">
                    {activeTool === 'sip' ? 'Wealth Projections' : activeTool === 'average' ? 'Weighted Average' : 'Allotment Chance'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
                  {activeTool === 'sip' ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <Coins size={12} /> Total Invested
                        </div>
                        <p className="text-3xl font-black">₹{sipResults.invested.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                          <PieChart size={12} /> Estimated Returns
                        </div>
                        <p className="text-3xl font-black text-emerald-500">₹{sipResults.gains.toLocaleString('en-IN')}</p>
                      </div>
                    </>
                  ) : activeTool === 'average' ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <Plus size={12} /> Total Quantity
                        </div>
                        <p className="text-3xl font-black">{avgResults.totalQty}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <Coins size={12} /> Total Cost
                        </div>
                        <p className="text-3xl font-black">₹{avgResults.totalCost.toLocaleString('en-IN')}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                           Ratio Analysis
                        </div>
                        <p className="text-3xl font-black">1 : { (Number(appliedShares) / (Number(offeredShares) || 1)).toFixed(1) }</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">Applications per Share</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                           Subscription
                        </div>
                        <p className="text-3xl font-black">{ (Number(appliedShares) / (Number(offeredShares) || 1)).toFixed(2) }x</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">Total Over-demand</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-auto p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-md">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                     {activeTool === 'sip' ? 'Est. Final Value' : activeTool === 'average' ? 'Avg. Cost per Unit' : 'Individual Probability'}
                   </p>
                   <p className="text-6xl sm:text-8xl font-black text-emerald-400 tracking-tighter overflow-hidden truncate">
                     {activeTool === 'sip' 
                        ? `₹${sipResults.total.toLocaleString('en-IN')}` 
                        : activeTool === 'average' 
                           ? `₹${avgResults.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                           : `${probResults.toFixed(2)}%`
                      }
                   </p>
                   {activeTool === 'probability' && (
                     <div className="mt-6 w-full h-3 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${probResults}%` }}></div>
                     </div>
                   )}
                </div>
                
                <div className="mt-10 flex items-start gap-3 p-5 bg-white/5 rounded-3xl border border-white/5">
                  <Info size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
                    {activeTool === 'sip' 
                      ? "Calculation assumes monthly compounding. Actual results depends on asset performance."
                      : activeTool === 'average'
                        ? "Calculation based on weighted average formula. Taxes and STT are not included."
                        : "Formula: (Shares Offered / Shares Applied) × 100. This is an mathematical estimate of base probability."}
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
