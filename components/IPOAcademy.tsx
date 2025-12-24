
import React, { useState } from 'react';
import { ArrowLeft, Landmark, BarChart, Clock, RefreshCw, Users, ShieldCheck, Target, Zap, Rocket, Info, ChevronRight } from 'lucide-react';

interface AcademyModule {
  id: string;
  title: string;
  category: 'Basics' | 'Strategy' | 'Policy' | 'Advanced';
  icon: React.ReactNode;
  summary: string;
  details: React.ReactNode;
  span?: string;
}

const IPOAcademy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const modules: AcademyModule[] = [
    {
      id: 'lifecycle',
      title: 'The IPO Lifecycle',
      category: 'Basics',
      span: 'lg:col-span-2',
      icon: <RefreshCw size={24} className="text-emerald-500" />,
      summary: 'From DRHP filing to the listing bell.',
      details: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            { step: '01', title: 'DRHP', desc: 'SEBI filing' },
            { step: '02', title: 'Roadshow', desc: 'Institution pitch' },
            { step: '03', title: 'Listing', desc: 'Market debut' }
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-2xl bg-white/30 dark:bg-slate-900/30 border border-slate-200/10">
              <span className="text-[10px] font-black text-emerald-500">{item.step}</span>
              <p className="text-sm font-black text-slate-800 dark:text-white">{item.title}</p>
              <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'anchor-effect',
      title: 'The Anchor Investor Effect',
      category: 'Strategy',
      icon: <Landmark size={24} className="text-indigo-500" />,
      summary: 'Decoding Smart Money signals.',
      details: (
        <div className="space-y-3 mt-4">
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            When big institutions buy 30 days before the IPO, it’s a <span className="text-indigo-500 font-bold uppercase">Smart Money</span> signal.
          </p>
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
            Validation: Strong anchor demand usually indicates high institutional confidence.
          </div>
        </div>
      )
    },
    {
      id: 'ofs-vs-fresh',
      title: 'OFS vs Fresh Issue',
      category: 'Basics',
      icon: <Zap size={24} className="text-amber-500" />,
      summary: 'Where is the capital moving?',
      details: (
        <div className="space-y-4 mt-4">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">Fresh Issue</p>
              <p className="text-[10px] text-slate-500">Company raising money for growth.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5" />
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">OFS</p>
              <p className="text-[10px] text-slate-500">Existing founders selling shares.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 't3-listing',
      title: 'T+3 Listing Rule',
      category: 'Policy',
      icon: <Clock size={24} className="text-blue-500" />,
      summary: 'Speed is the new market standard.',
      details: (
        <div className="mt-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The new SEBI rule mandates IPOs list just <span className="text-blue-500 font-bold">3 working days</span> after closing, reducing capital lock-in time.
          </p>
        </div>
      )
    },
    {
      id: 'sme-vs-main',
      title: 'SME vs Mainboard',
      category: 'Advanced',
      icon: <Target size={24} className="text-rose-500" />,
      summary: 'Risk, reward, and liquidity.',
      details: (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-[10px] border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-slate-500">Min Amount</span>
            <span className="font-bold">Main: ₹15k | SME: ₹1.2L+</span>
          </div>
          <div className="flex justify-between text-[10px] pt-2">
            <span className="text-slate-500">Volatility</span>
            <span className="font-bold text-rose-500">SME is Higher</span>
          </div>
        </div>
      )
    },
    {
      id: 'investor-quotas',
      title: 'Quota Allocation',
      category: 'Strategy',
      icon: <Users size={24} className="text-emerald-500" />,
      summary: 'Who gets what in an IPO?',
      details: (
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-bold">Retail: 35%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-bold">QIB: 50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-amber-500 rounded-full" />
            <span className="text-[10px] font-bold">NII: 15%</span>
          </div>
        </div>
      )
    }
  ];

  const CategoryBadge = ({ type }: { type: AcademyModule['category'] }) => {
    const colors = {
      Basics: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      Strategy: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      Policy: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      Advanced: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    };
    return (
      <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${colors[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <button 
              onClick={onBack}
              className="sticky top-20 z-50 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-600 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20 shadow-lg w-fit"
            >
              <ArrowLeft size={16} strokeWidth={3} />
              Back to Dashboard
            </button>
            <div className="space-y-2">
              <h2 className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Academy</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-xl max-w-xl">
                Master the terminal. Understand the mechanics of India's primary market.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => (
            <div 
              key={module.id} 
              style={{ animationDelay: `${idx * 100}ms` }}
              className={`group relative overflow-hidden p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/20 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up flex flex-col ${module.span || ''}`}
            >
              <div className="flex justify-between items-start mb-6">
                <CategoryBadge type={module.category} />
                <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                  {module.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-emerald-500 transition-colors">
                {module.title}
              </h3>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                {module.summary}
              </p>
              
              <div className="mt-auto">
                {module.details}
              </div>
              
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} className="text-emerald-500" />
              </div>
            </div>
          ))}

          {/* Special Quiz Teaser Card */}
          <div className="lg:col-span-3 p-8 sm:p-12 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  <Rocket size={12} /> Live Knowledge Test
                </div>
                <h3 className="text-3xl sm:text-5xl font-black tracking-tighter">Ready for the Markets?</h3>
                <p className="text-slate-400 font-medium max-w-md">Test your understanding of Anchor investors and T+3 rules to unlock the Terminal Master badge.</p>
              </div>
              <button className="px-10 py-5 bg-white text-slate-900 text-sm font-black uppercase tracking-widest rounded-[1.5rem] hover:bg-emerald-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                Start Certification
              </button>
            </div>
          </div>
        </div>
        
        <footer className="mt-20 text-center pb-12">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
            Educational Purpose Only • © 2025 Terminal
          </p>
        </footer>
      </div>
    </div>
  );
};

export default IPOAcademy;
