import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { TABS, RECENTLY_LISTED_DATA } from './constants';
import { IPO, IPOStatus, InvestmentDetails, AppView } from './types';
import IPOCard from './components/IPOCard';
import InvestmentModal from './components/InvestmentModal';
import TickerTape from './components/TickerTape';
import IPOAcademy from './components/IPOAcademy';
import FinancialTools from './components/FinancialTools';
import { fetchIPOs } from './services/ipoService';
import { Home, BookOpen, Search, Sun, Moon, RefreshCw, LayoutDashboard, X, Heart, CloudOff, Key, ExternalLink, AlertCircle, Clock, Timer, TrendingUp, Wrench } from 'lucide-react';

const TS_KEY = 'ipo_data_timestamp';
const CACHE_DURATION_MS = 60 * 60 * 1000;

const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col h-full animate-pulse shadow-sm">
    <div className="h-8 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full mb-6"></div>
    <div className="h-24 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] mb-6"></div>
    <div className="space-y-4">
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
      <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
    </div>
    <div className="mt-auto flex gap-2 pt-6">
      <div className="h-10 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      <div className="h-10 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('tracker');
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [activeTab, setActiveTab] = useState<IPOStatus | 'Favorites'>('Open');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDataStale, setIsDataStale] = useState(false);
  
  // Timer states
  const [lastUpdatedTs, setLastUpdatedTs] = useState<number>(() => parseInt(localStorage.getItem(TS_KEY) || "0"));
  const [minutesAgo, setMinutesAgo] = useState<number>(0);
  const [timeLeftFormatted, setTimeLeftFormatted] = useState<string>("60:00");

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ipo_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  const toggleTheme = () => setDarkMode(prev => !prev);

  // API Key Check
  useEffect(() => {
    const checkKey = async () => {
      try {
        // @ts-ignore
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          // @ts-ignore
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else {
          setHasApiKey(true); 
        }
      } catch (err) {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    try {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
      }
    } catch (err) {
      console.error("Failed to open key dialog", err);
    }
  };

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdatedTs === 0) return;
      
      const now = Date.now();
      const diffMs = now - lastUpdatedTs;
      const mins = Math.floor(diffMs / 60000);
      setMinutesAgo(mins);

      const remainingMs = Math.max(0, CACHE_DURATION_MS - diffMs);
      const remainingSecsTotal = Math.floor(remainingMs / 1000);
      const m = Math.floor(remainingSecsTotal / 60);
      const s = remainingSecsTotal % 60;
      
      setTimeLeftFormatted(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

      if (remainingMs === 0 && !isRefreshing && currentView === 'tracker') {
        loadIPOData(true, false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdatedTs, isRefreshing, currentView]);

  useEffect(() => {
    localStorage.setItem('ipo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const loadIPOData = useCallback(async (isSilent = false, forceRefresh = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);
    setApiError(null);

    try {
      const data = await fetchIPOs(forceRefresh);
      setIpos(data);
      setIsDataStale(!data.every(i => i.isLive));
      
      const newTs = parseInt(localStorage.getItem(TS_KEY) || Date.now().toString());
      setLastUpdatedTs(newTs);
    } catch (error: any) {
      console.error("Data fetch error:", error);
      if (error.fallbackData) setIpos(error.fallbackData);

      if (error?.message?.includes('429')) {
        setApiError("Live data is resting. Using latest cached info.");
      } else if (error?.message?.includes("Requested entity was not found")) {
        setApiError("API Key mismatch. Please re-select your key.");
        setHasApiKey(false);
      } else {
        setApiError("Terminal connection weak. Showing latest snapshots.");
      }
      setIsDataStale(true);
      const newTs = parseInt(localStorage.getItem(TS_KEY) || Date.now().toString());
      setLastUpdatedTs(newTs);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (hasApiKey && currentView === 'tracker') {
      loadIPOData(true);
    }
  }, [hasApiKey, currentView, loadIPOData]);

  const filteredIPOs = useMemo(() => {
    // If Recently Listed tab is active, use the hardcoded static performance data
    if (activeTab === 'Listed') {
      return RECENTLY_LISTED_DATA.filter(ipo => 
        ipo.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return ipos.filter((ipo) => {
      const matchesTab = activeTab === 'Favorites' ? favorites.includes(ipo.id) : ipo.status === activeTab;
      const matchesSearch = ipo.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, ipos, favorites]);

  const globalSearchIPOs = useMemo(() => {
    if (!searchQuery) return [];
    const all = [...ipos, ...RECENTLY_LISTED_DATA];
    return all.filter((ipo) => ipo.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
  }, [searchQuery, ipos]);

  if (hasApiKey === null) return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#1e293b] p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto">
            <Key className="text-emerald-500" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">API Key Required</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">To access real-time market data and AI insights, please select your Paid Google AI Studio API key.</p>
          </div>
          <button 
            onClick={handleOpenKeyDialog}
            className="w-full py-5 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            Connect API Key
          </button>
        </div>
      </div>
    );
  }

  const openSearchModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchModalOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  const handleNavClick = (e: React.MouseEvent, view: AppView) => {
    e.stopPropagation();
    setCurrentView(view);
    setIsSearchModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-500 overflow-x-hidden">
      <header className="sticky top-0 z-50 glass-header border-b border-slate-200/40 dark:border-slate-800/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer group" onClick={(e) => handleNavClick(e, 'tracker')}>
              <div className="w-10 h-10 bg-[#00d09c] rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter hidden xs:block uppercase tracking-wider">IPO LIVE</h1>
            </div>

            <nav className="hidden md:flex items-center gap-3">
              <button 
                onClick={(e) => handleNavClick(e, 'tracker')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all border ${currentView === 'tracker' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50 hover:backdrop-blur-md'}`}
              >
                Tracker
              </button>
              <button 
                onClick={(e) => handleNavClick(e, 'tools')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all border ${currentView === 'tools' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50 hover:backdrop-blur-md'}`}
              >
                Tools
              </button>
              <button 
                onClick={(e) => handleNavClick(e, 'academy')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all border ${currentView === 'academy' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50 hover:backdrop-blur-md'}`}
              >
                Academy
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="relative flex-1 max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-slate-200/60 dark:border-slate-700/60 rounded-full bg-slate-50 dark:bg-slate-900/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm dark:text-white font-medium"
                placeholder="Find an IPO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={toggleTheme} className="p-2.5 rounded-2xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-90">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => loadIPOData(false, true)} 
              title="Manual Refresh (Bypasses Cache)"
              className="p-2.5 rounded-2xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-90"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin text-emerald-500' : ''} />
            </button>
          </div>
        </div>
      </header>

      {apiError && (
        <div className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 px-4 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300 shadow-lg relative z-[45]">
          <AlertCircle size={16} strokeWidth={3} />
          {apiError}
          <button onClick={() => setApiError(null)} className="ml-4 opacity-70 hover:opacity-100 transition-opacity"><X size={16} strokeWidth={3}/></button>
        </div>
      )}

      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl p-6 sm:p-12 animate-in fade-in zoom-in duration-300">
          <div className="max-w-4xl mx-auto flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase tracking-[0.1em]">Search Markets</h2>
              <button onClick={closeSearchModal} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"><X size={24} /></button>
            </div>
            <div className="relative mb-10">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00d09c]" size={28} />
              <input ref={searchInputRef} type="text" className="w-full pl-16 pr-6 py-6 text-2xl sm:text-4xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500" placeholder="Type name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {globalSearchIPOs.map(ipo => (
                <div key={ipo.id} onClick={() => { setActiveTab(ipo.status); setCurrentView('tracker'); setIsSearchModalOpen(false); }} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] hover:border-emerald-500 cursor-pointer group">
                  <h4 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-emerald-500">{ipo.name}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{ipo.status} • {ipo.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <TickerTape />

      <main className="flex-1 w-full pb-[140px] md:pb-16">
        <div className={`transition-all duration-700 ${currentView !== 'tracker' ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'}`}>
          {currentView === 'tracker' && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col gap-8 sm:gap-16">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-2 sm:px-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
                      {activeTab === 'Listed' ? 'Performance' : 'Terminal'}
                    </h2>
                    {isRefreshing && activeTab !== 'Listed' && <RefreshCw size={24} className="text-emerald-500 animate-spin mt-2" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {activeTab === 'Listed' ? (
                       <div className="flex items-center gap-2 sm:gap-3 bg-indigo-500/5 border border-indigo-500/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm">
                         <TrendingUp size={12} className="text-indigo-500 sm:w-4 sm:h-4" />
                         <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500">
                           Tracking: <span className="text-indigo-600 dark:text-indigo-400">Post-Listing Returns</span>
                         </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 sm:gap-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm">
                          <Clock size={12} className="text-slate-400 sm:w-4 sm:h-4" />
                          <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500">
                            Updated: <span className="text-emerald-500">{minutesAgo}m ago</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 bg-emerald-500/5 border border-emerald-500/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm">
                          <Timer size={12} className="text-emerald-500 sm:w-4 sm:h-4" />
                          <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500">
                            Next in: <span className="text-emerald-600 dark:text-emerald-400 font-black">{timeLeftFormatted}</span>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-[1.5rem] sm:p-1.5 sm:rounded-[2.5rem] w-full sm:w-fit border border-slate-200/50 dark:border-slate-800/50 overflow-x-auto no-scrollbar shadow-inner">
                  {TABS.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as IPOStatus)} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                      {tab.label}
                    </button>
                  ))}
                  <button onClick={() => setActiveTab('Favorites')} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${activeTab === 'Favorites' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                     <Heart size={10} className="sm:w-3 sm:h-3" fill={activeTab === 'Favorites' ? 'currentColor' : 'none'} /> Saved
                  </button>
                </div>
              </div>

              {isLoading && filteredIPOs.length === 0 && activeTab !== 'Listed' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-12">
                  {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
                </div>
              ) : filteredIPOs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-12">
                  {filteredIPOs.map((ipo, idx) => (
                    <div key={ipo.id} style={{ animationDelay: `${idx * 40}ms` }} className="animate-fade-in-up h-full">
                      <IPOCard 
                        ipo={ipo} 
                        onCheckInvestment={setSelectedInvestment}
                        isFavorite={favorites.includes(ipo.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white/40 dark:bg-slate-900/20 rounded-[2.5rem] sm:rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800/50">
                  <Search size={48} className="text-slate-300 dark:text-slate-700 mb-6" />
                  <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-center px-4">No matching items found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`transition-all duration-700 ${currentView !== 'tools' ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'}`}>
          {currentView === 'tools' && (
            <FinancialTools onBack={() => setCurrentView('tracker')} />
          )}
        </div>

        <div className={`transition-all duration-700 ${currentView !== 'academy' ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'}`}>
          {currentView === 'academy' && (
            <IPOAcademy onBack={() => setCurrentView('tracker')} />
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full h-24 md:hidden z-[60] px-6 pb-6 pointer-events-none">
        <div className="w-full h-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[2.8rem] shadow-xl flex items-center justify-around pointer-events-auto">
          <button onClick={(e) => handleNavClick(e, 'tracker')} className={`flex flex-col items-center gap-1.5 w-1/4 ${currentView === 'tracker' && !isSearchModalOpen ? 'text-emerald-500 scale-110' : 'text-slate-400'}`}>
            <Home size={22} strokeWidth={currentView === 'tracker' ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">Dash</span>
          </button>
          <button onClick={(e) => handleNavClick(e, 'tools')} className={`flex flex-col items-center gap-1.5 w-1/4 ${currentView === 'tools' ? 'text-emerald-500 scale-110' : 'text-slate-400'}`}>
            <Wrench size={22} strokeWidth={currentView === 'tools' ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">Tools</span>
          </button>
          <button onClick={openSearchModal} className={`flex flex-col items-center gap-1.5 w-1/4 ${isSearchModalOpen ? 'text-emerald-500 scale-110' : 'text-slate-400'}`}>
            <Search size={22} strokeWidth={isSearchModalOpen ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">Find</span>
          </button>
          <button onClick={(e) => handleNavClick(e, 'academy')} className={`flex flex-col items-center gap-1.5 w-1/4 ${currentView === 'academy' ? 'text-emerald-500 scale-110' : 'text-slate-400'}`}>
            <BookOpen size={22} strokeWidth={currentView === 'academy' ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">Learn</span>
          </button>
        </div>
      </nav>

      <InvestmentModal details={selectedInvestment} onClose={() => setSelectedInvestment(null)} />
    </div>
  );
};

export default App;