import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ArrowLeft, 
  Zap, 
  IndianRupee, 
  PieChart as PieIcon,
  Percent,
  Activity,
  ArrowRight,
  TrendingDown,
  Info,
  Layers,
  ShoppingBag,
  BadgePercent,
  Coins
} from 'lucide-react';

const formatINR = (val: number, fractionDigits: number = 0) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  }).format(val);
};

/**
 * Generic Card Components for consistent UI
 */
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-[#0f172a] rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle, icon: Icon, colorClass = "text-indigo-500" }: { title: string, subtitle?: string, icon: any, colorClass?: string }) => (
  <div className="px-8 pt-8 flex items-center justify-between mb-4">
    <div className="space-y-1">
      {subtitle && <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${colorClass}`}>{subtitle}</p>}
      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{title}</h3>
    </div>
    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 ${colorClass}`}>
      <Icon size={28} />
    </div>
  </div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-8 pt-4 flex flex-col gap-6 flex-1 ${className}`}>
    {children}
  </div>
);

const NumericTerminalInput = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon,
  isCurrency = false,
  isPercent = false,
  placeholder = "0"
}: { 
  label: string, 
  value: number | string, 
  onChange: (val: string) => void,
  icon: React.ElementType,
  isCurrency?: boolean,
  isPercent?: boolean,
  placeholder?: string
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = useMemo(() => {
    if (isFocused) return value === 0 ? "" : value;
    const num = Number(value);
    if (isNaN(num)) return value;
    return isCurrency ? formatINR(num) : num.toString();
  }, [value, isFocused, isCurrency]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    onChange(raw);
  };

  return (
    <div className="space-y-3 w-full">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
        <Icon size={12} className="text-indigo-500" />
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
          {isCurrency ? <IndianRupee size={20} strokeWidth={3} /> : isPercent ? <Percent size={20} strokeWidth={3} /> : <Layers size={20} strokeWidth={3} />}
        </div>
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
          placeholder={placeholder}
          className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 p-6 pl-16 rounded-[2rem] font-black text-2xl dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
        />
      </div>
    </div>
  );
};

const FinancialTools: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // 1. IPO Listing Gain State
  const [lotSize, setLotSize] = useState<string>("30");
  const [gmp, setGmp] = useState<string>("150");

  // 2. Allotment Probability State
  const [subscriptionX, setSubscriptionX] = useState<string>("10");

  // 3. Tax/Brokerage State
  const [tradeValue, setTradeValue] = useState<string>("100000");

  // Calculations
  const listingGain = useMemo(() => {
    const g = Number(gmp) || 0;
    const l = Number(lotSize) || 0;
    return g * l;
  }, [gmp, lotSize]);

  const allotmentProb = useMemo(() => {
    const x = Number(subscriptionX) || 0;
    if (x <= 1) return 100;
    return (1 / x) * 100;
  }, [subscriptionX]);

  const taxResults = useMemo(() => {
    const val = Number(tradeValue) || 0;
    const stt = val * 0.001; // 0.1% STT
    const standardBrokerage = 20;
    const gst = standardBrokerage * 0.18; // 18% GST on brokerage
    const totalCharges = stt + standardBrokerage + gst;
    return { stt, gst, totalCharges };
  }, [tradeValue]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-600 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20 shadow-lg w-fit">
          <ArrowLeft size={16} strokeWidth={3} /> Back to Dashboard
        </button>
        <div className="space-y-2">
          <h2 className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">FinTools</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-xl max-w-xl">Mathematical models for listing gains, success odds, and transaction tax forecasting.</p>
        </div>
      </header>

      {/* Grid Layout: 2 Column Desktop, 1 Column Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* IPO Listing Gain Calculator */}
        <Card>
          <CardHeader title="Listing Gain" subtitle="IPO Analytics" icon={TrendingUp} colorClass="text-emerald-500" />
          <CardContent>
            <NumericTerminalInput label="Lot Size (Shares)" value={lotSize} onChange={setLotSize} icon={Layers} />
            <NumericTerminalInput label="GMP (Grey Market Premium)" value={gmp} onChange={setGmp} icon={Zap} isCurrency />
            
            <div className="mt-4 p-8 bg-emerald-500 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
               <TrendingUp className="absolute right-[-5%] top-[-10%] opacity-10" size={120} />
               <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Estimated Gain per Lot</p>
                 <p className="text-5xl font-black tracking-tighter leading-none">₹{formatINR(listingGain)}</p>
                 <p className="text-[10px] font-bold mt-4 opacity-70 italic">* Based on current unofficial grey market sentiment.</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Allotment Odds */}
        <Card>
          <CardHeader title="Allotment Odds" subtitle="Probabilistic" icon={PieIcon} colorClass="text-indigo-500" />
          <CardContent>
            <NumericTerminalInput label="Subscription (Times X)" value={subscriptionX} onChange={setSubscriptionX} icon={Activity} />
            
            <div className="mt-4 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Success Probability</p>
              <div className="relative">
                <p className="text-7xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {allotmentProb.toFixed(1)}<span className="text-indigo-500">%</span>
                </p>
              </div>
              <p className="text-xs font-bold text-slate-500 mt-2">
                1 in {Number(subscriptionX) > 0 ? Number(subscriptionX).toFixed(1) : "0"} retail applications gets allotted.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tax & Fees - Two Column Child Grid on Large Screens */}
        <Card className="lg:col-span-2">
          <CardHeader title="Tax & Brokerage Terminal" subtitle="Execution Costs" icon={BadgePercent} colorClass="text-rose-500" />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <p className="text-sm font-medium text-slate-500">Calculate statutory levies and standard flat-fee brokerage for secondary market trades.</p>
              <NumericTerminalInput label="Hypothetical Trade Value" value={tradeValue} onChange={setTradeValue} icon={Coins} isCurrency />
            </div>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STT (0.1%)</span>
                 <span className="text-xl font-black text-slate-900 dark:text-white">₹{formatINR(taxResults.stt, 2)}</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST on Fees (18%)</span>
                 <span className="text-xl font-black text-slate-900 dark:text-white">₹{formatINR(taxResults.gst, 2)}</span>
               </div>
               <div className="p-8 bg-rose-500 rounded-[2.5rem] text-white shadow-2xl shadow-rose-500/20">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Net Transaction Cost</p>
                 <p className="text-4xl font-black tracking-tighter">₹{formatINR(taxResults.totalCharges, 2)}</p>
               </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="flex items-start gap-4 p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10">
        <Info size={24} className="text-indigo-500 shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Model Limitations</p>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            All calculations are mathematical estimations processed locally. Actual listing prices are determined by market forces. Tax calculations assume standard SEBI/GST rates which are subject to regulatory changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialTools;