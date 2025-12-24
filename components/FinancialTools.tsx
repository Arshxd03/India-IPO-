import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowLeft, 
  Zap, 
  IndianRupee, 
  PieChart as PieIcon,
  Percent,
  Activity,
  Info,
  Layers,
  ShoppingBag,
  BadgePercent,
  Coins,
  Calendar,
  Scale,
  ShieldCheck,
  PiggyBank,
  Wallet,
  Clock
} from 'lucide-react';

const formatINR = (val: number, fractionDigits: number = 0) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  }).format(val);
};

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-[#0f172a] rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  colorClass?: string;
  infoText?: string;
}

const CardHeader = ({ title, subtitle, icon: Icon, colorClass = "text-indigo-500", infoText }: CardHeaderProps) => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="px-8 pt-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {subtitle && <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${colorClass}`}>{subtitle}</p>}
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{title}</h3>
            {infoText && (
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-colors"
              >
                <Info size={14} />
              </button>
            )}
          </div>
        </div>
        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 ${colorClass}`}>
          <Icon size={28} />
        </div>
      </div>
      {showInfo && infoText && (
        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 leading-relaxed uppercase tracking-wider">
            {infoText}
          </p>
        </div>
      )}
    </div>
  );
};

const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-8 pt-4 flex flex-col gap-6 flex-1 ${className}`}>
    {children}
  </div>
);

interface NumericTerminalInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ElementType;
  isCurrency?: boolean;
  isPercent?: boolean;
  placeholder?: string;
}

const NumericTerminalInput = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon,
  isCurrency = false,
  isPercent = false,
  placeholder = "0"
}: NumericTerminalInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = useMemo(() => {
    if (isFocused) return value === "0" ? "" : value;
    const num = Number(value);
    if (isNaN(num)) return value;
    return isCurrency ? formatINR(num) : num.toString();
  }, [value, isFocused, isCurrency]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    onChange(raw || "0");
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

const DonutChart = ({ invested, profit }: { invested: number, profit: number }) => {
  const total = invested + profit;
  const investedPercent = total === 0 ? 0 : (invested / total) * 100;
  const profitPercent = total === 0 ? 0 : (profit / total) * 100;
  
  const strokeWidth = 12;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const investedOffset = circumference - (investedPercent / 100) * circumference;
  const profitOffset = circumference - (profitPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100 dark:text-slate-800" />
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={investedOffset} className="text-indigo-500" strokeLinecap="round" />
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={profitOffset} className="text-emerald-500" strokeLinecap="round" transform={`rotate(${(investedPercent / 100) * 360} 50 50)`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">₹{formatINR(total)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[160px]">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-slate-400">Invested</span>
          </div>
          <span className="text-slate-900 dark:text-white">{investedPercent.toFixed(0)}%</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Profit</span>
          </div>
          <span className="text-slate-900 dark:text-white">{profitPercent.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

const FinancialTools: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Existing Tools State
  const [lotSize, setLotSize] = useState<string>("30");
  const [gmp, setGmp] = useState<string>("150");
  const [subscriptionX, setSubscriptionX] = useState<string>("10");
  const [tradeValue, setTradeValue] = useState<string>("100000");

  // Advanced Tools State
  const [cagrInitial, setCagrInitial] = useState<string>("100000");
  const [cagrFinal, setCagrFinal] = useState<string>("250000");
  const [cagrYears, setCagrYears] = useState<string>("5");

  const [cgGain, setCgGain] = useState<string>("200000");
  const [cgIsLongTerm, setCgIsLongTerm] = useState<boolean>(true);

  const [grahamEPS, setGrahamEPS] = useState<string>("45");
  const [grahamGrowth, setGrahamGrowth] = useState<string>("12");
  const [grahamYield, setGrahamYield] = useState<string>("7.5");

  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("50000");

  // SIP/Lumpsum State
  const [investMode, setInvestMode] = useState<'SIP' | 'Lumpsum'>('SIP');
  const [investAmount, setInvestAmount] = useState<string>("5000");
  const [expectedReturn, setExpectedReturn] = useState<string>("12");
  const [investYears, setInvestYears] = useState<string>("10");

  // Calculations
  const sipLumpsumResults = useMemo(() => {
    const P = Number(investAmount) || 0;
    const r = (Number(expectedReturn) || 0) / 100;
    const n = Number(investYears) || 0;
    
    let totalValue = 0;
    let totalInvested = 0;

    if (investMode === 'SIP') {
      const monthlyRate = r / 12;
      const totalMonths = n * 12;
      if (monthlyRate === 0) {
        totalValue = P * totalMonths;
      } else {
        totalValue = P * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      }
      totalInvested = P * totalMonths;
    } else {
      totalValue = P * Math.pow(1 + r, n);
      totalInvested = P;
    }

    const totalProfit = Math.max(0, totalValue - totalInvested);
    return { totalValue, totalInvested, totalProfit };
  }, [investMode, investAmount, expectedReturn, investYears]);

  const listingGain = useMemo(() => (Number(gmp) || 0) * (Number(lotSize) || 0), [gmp, lotSize]);
  const allotmentProb = useMemo(() => {
    const x = Number(subscriptionX) || 0;
    return x <= 1 ? 100 : (1 / x) * 100;
  }, [subscriptionX]);
  const taxResults = useMemo(() => {
    const val = Number(tradeValue) || 0;
    const stt = val * 0.001;
    const standardBrokerage = 20;
    const gst = standardBrokerage * 0.18;
    return { stt, gst, totalCharges: stt + standardBrokerage + gst };
  }, [tradeValue]);

  const cagrResult = useMemo(() => {
    const start = Number(cagrInitial) || 1;
    const end = Number(cagrFinal) || 0;
    const years = Number(cagrYears) || 1;
    if (start <= 0 || years <= 0) return 0;
    return (Math.pow(end / start, 1 / years) - 1) * 100;
  }, [cagrInitial, cagrFinal, cagrYears]);

  const capitalGainTax = useMemo(() => {
    const gain = Number(cgGain) || 0;
    if (cgIsLongTerm) {
      return Math.max(0, gain - 125000) * 0.125;
    } else {
      return gain * 0.20;
    }
  }, [cgGain, cgIsLongTerm]);

  const grahamValue = useMemo(() => {
    const eps = Number(grahamEPS) || 0;
    const g = Number(grahamGrowth) || 0;
    const y = Number(grahamYield) || 1;
    return eps * (8.5 + 2 * g) * (4.4 / y);
  }, [grahamEPS, grahamGrowth, grahamYield]);

  const emergencyFund = useMemo(() => (Number(monthlyExpenses) || 0) * 6, [monthlyExpenses]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-600 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20 shadow-lg w-fit">
          <ArrowLeft size={16} strokeWidth={3} /> Back to Dashboard
        </button>
        <div className="space-y-2">
          <h2 className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">FinTools</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-xl max-w-xl">Precision terminals for primary markets, taxation, and long-term compounding.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* SIP & Lumpsum Calculator */}
        <Card className="lg:col-span-2">
          <CardHeader title="Wealth Terminal" subtitle="Compounding" icon={Wallet} colorClass="text-indigo-500" infoText="SIP (Systematic Investment Plan) uses periodic compounding. Lumpsum uses annual compounding. SIP Formula: P × [((1+i)^n - 1) / i] × (1+i)." />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <button onClick={() => setInvestMode('SIP')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${investMode === 'SIP' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500'}`}>SIP Mode</button>
                <button onClick={() => setInvestMode('Lumpsum')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${investMode === 'Lumpsum' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500'}`}>Lumpsum</button>
              </div>
              <NumericTerminalInput label={investMode === 'SIP' ? "Monthly Investment" : "One-time Investment"} value={investAmount} onChange={setInvestAmount} icon={Coins} isCurrency />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumericTerminalInput label="Expected Return" value={expectedReturn} onChange={setExpectedReturn} icon={Percent} isPercent />
                <NumericTerminalInput label="Time Period (Yrs)" value={investYears} onChange={setInvestYears} icon={Clock} />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-800">
               <DonutChart invested={sipLumpsumResults.totalInvested} profit={sipLumpsumResults.totalProfit} />
               <div className="flex-1 space-y-6 w-full">
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Wealth Gained</p>
                    <p className="text-3xl font-black text-emerald-500">₹{formatINR(sipLumpsumResults.totalProfit)}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Maturity Amount</p>
                    <p className="text-3xl font-black text-indigo-500">₹{formatINR(sipLumpsumResults.totalValue)}</p>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="CAGR" subtitle="Growth Analysis" icon={Calendar} colorClass="text-blue-500" infoText="CAGR (Compound Annual Growth Rate) formula: [(Final/Initial)^(1/Years)] - 1. It provides a smoothed rate of return over time." />
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumericTerminalInput label="Initial Value" value={cagrInitial} onChange={setCagrInitial} icon={Coins} isCurrency />
              <NumericTerminalInput label="Final Value" value={cagrFinal} onChange={setCagrFinal} icon={TrendingUp} isCurrency />
            </div>
            <NumericTerminalInput label="Years" value={cagrYears} onChange={setCagrYears} icon={Activity} />
            <div className="p-8 bg-blue-500 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Annualized Return</p>
              <p className="text-6xl font-black tracking-tighter">{cagrResult.toFixed(2)}<span className="text-2xl font-bold ml-1">%</span></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Taxation" subtitle="Capital Gains" icon={BadgePercent} colorClass="text-rose-500" infoText="LTCG: 12.5% on gains > ₹1.25 Lakh. STCG: 20% flat. Rates as per Indian Union Budget 2024-25." />
          <CardContent>
            <NumericTerminalInput label="Total Profit / Gain" value={cgGain} onChange={setCgGain} icon={Coins} isCurrency />
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button onClick={() => setCgIsLongTerm(false)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!cgIsLongTerm ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'}`}>Short Term</button>
              <button onClick={() => setCgIsLongTerm(true)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${cgIsLongTerm ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'}`}>Long Term</button>
            </div>
            <div className="p-8 bg-rose-500 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Estimated Tax</p>
              <p className="text-5xl font-black tracking-tighter">₹{formatINR(capitalGainTax)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Graham Value" subtitle="Intrinsic Pricing" icon={Scale} colorClass="text-amber-500" infoText="Formula: EPS × (8.5 + 2g) × 4.4 / Y. Helps find value relative to earnings growth and bond yields." />
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumericTerminalInput label="EPS" value={grahamEPS} onChange={setGrahamEPS} icon={Coins} />
              <NumericTerminalInput label="Growth (g %)" value={grahamGrowth} onChange={setGrahamGrowth} icon={TrendingUp} isPercent />
            </div>
            <NumericTerminalInput label="Bond Yield (Y %)" value={grahamYield} onChange={setGrahamYield} icon={Activity} isPercent />
            <div className="p-8 bg-amber-500 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Intrinsic Price</p>
              <p className="text-5xl font-black tracking-tighter">₹{formatINR(grahamValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Safety Net" subtitle="Risk Planning" icon={PiggyBank} colorClass="text-emerald-500" infoText="Standard financial advice suggests maintaining 6 months of monthly expenses as a liquid emergency fund." />
          <CardContent>
            <NumericTerminalInput label="Monthly Expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} icon={ShoppingBag} isCurrency />
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center gap-2">
               <ShieldCheck size={48} className="text-emerald-500 mb-2" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Emergency Fund Goal</p>
               <p className="text-5xl font-black text-emerald-500 tracking-tighter">₹{formatINR(emergencyFund)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-4 p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10">
        <Info size={24} className="text-indigo-500 shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Terminal Notice</p>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            All calculations are performed locally using standard mathematical models. Actual taxation and investment returns are subject to regulatory changes and market volatility. No data is sent to external servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialTools;