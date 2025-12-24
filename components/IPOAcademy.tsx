
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Landmark, RefreshCw, Zap, Clock, Target, Users, Rocket, 
  ChevronRight, CheckCircle2, XCircle, Trophy, RotateCcw, Info, 
  History, Milestone, ShieldCheck, Scale, TrendingUp, Presentation, 
  BookOpen, Building2, BarChart4, Gavel, Timer, Layers, Search,
  AlertCircle, SearchCode, Book, Filter
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  category: 'History' | 'Milestones' | 'Legends' | 'IPO Basics' | 'Modern Rules';
  icon: React.ElementType;
  summary: string;
}

const MARKET_TOPICS: Topic[] = [
  {
    id: 'banyan-tree',
    title: 'The Banyan Tree (1875)',
    category: 'History',
    icon: History,
    summary: "The Bombay Stock Exchange started under a banyan tree in the 1850s where stockbrokers would gather informally. In 1875, it officially became the Native Share & Stock Brokers' Association, the first formal exchange in Asia. This historic spot in Mumbai is now famously known across the globe as Dalal Street."
  },
  {
    id: 'premchand-roychand',
    title: 'Premchand Roychand',
    category: 'History',
    icon: Building2,
    summary: "He was one of the most influential businessmen in 19th-century Bombay and a founding member of the BSE. Known as the 'Cotton King', he played a pivotal role in establishing the first formal market rules and trading practices. His legacy remains a cornerstone of the institutional foundation of Indian financial history."
  },
  {
    id: '1956-act',
    title: '1956 Securities Act',
    category: 'History',
    icon: Gavel,
    summary: "This landmark Act provided the first comprehensive legal framework for regulating stock exchanges in independent India. It empowered the central government to recognize exchanges and provided tools to curb unhealthy speculative activities. This regulation was the essential precursor to all modern market governance we see today."
  },
  {
    id: '1991-liberalization',
    title: '1991 Liberalization',
    category: 'Milestones',
    icon: Milestone,
    summary: "The reforms of 1991 shifted India from a closed 'License Raj' economy to a market-linked global participant. This period saw the abolition of the Controller of Capital Issues, paving the way for SEBI to become an empowered statutory body. It fundamentally democratized how Indian companies raised capital from the public and foreign investors."
  },
  {
    id: 'nse-foundation',
    title: 'NSE Foundation (1992)',
    category: 'Milestones',
    icon: Presentation,
    summary: "The National Stock Exchange was established to provide a modern, fully automated screen-based trading system that removed regional barriers. It introduced nationwide reach and challenged the long-standing monopoly of physical regional exchanges like the BSE. Its success brought unprecedented transparency, liquidity, and competition to the Indian financial ecosystem."
  },
  {
    id: 'demat-1996',
    title: 'Dematerialization (1996)',
    category: 'Milestones',
    icon: Layers,
    summary: "The introduction of the Depositories Act enabled the transition from physical paper share certificates to electronic 'Demat' entries. This revolutionary move eliminated risks like theft, forgery, and bad deliveries that had plagued paper-based trading for decades. Today, nearly 100% of settlement happens instantly in digital form, making markets safer for retail users."
  },
  {
    id: 'harshad-mehta',
    title: 'The Harshad Mehta Era',
    category: 'Legends',
    icon: AlertCircle,
    summary: "The 1992 securities scam exposed massive loopholes in the banking system and its illegal nexus with the stock market. It led to the rapid modernization of market infrastructure and the granting of strict statutory powers to SEBI. The event remains the ultimate cautionary tale about systemic risk, regulatory gaps, and market greed."
  },
  {
    id: 'ketan-parekh',
    title: 'Ketan Parekh (2001)',
    category: 'Legends',
    icon: Target,
    summary: "This crisis involved the manipulation of specific 'K-10' technology stocks using circular trading and diverted bank funds. It triggered the ban on the old 'Badla' trading system and accelerated the shift towards a T+2 rolling settlement cycle. The fallout forced the adoption of global-standard institutional surveillance and risk management systems."
  },
  {
    id: '2008-crash',
    title: 'The 2008 Crash',
    category: 'Legends',
    icon: TrendingUp,
    summary: "Triggered by the global subprime crisis, the Indian markets saw a sharp correction of over 50% in the benchmark indices. It tested the resilience of Indian financial institutions and the effectiveness of the updated regulatory framework. The subsequent recovery demonstrated India's growing decoupling from purely Western economic dependencies."
  },
  {
    id: 'book-building',
    title: 'Book Building vs Fixed Price',
    category: 'IPO Basics',
    icon: BookOpen,
    summary: "In book building, the final price is discovered based on actual investor demand within a specified price band during the bidding period. Fixed price issues have a pre-determined price set by the company long before the issue actually opens. Most modern Mainboard IPOs use the book-building process as it ensures more efficient price discovery."
  },
  {
    id: 'drhp-concept',
    title: 'The Red Herring (DRHP)',
    category: 'IPO Basics',
    icon: SearchCode,
    summary: "The Draft Red Herring Prospectus is the 'Bible' for any IPO investor, containing all financials, legal risks, and business strategies. It is called 'Red Herring' because it intentionally omits the final price or exact number of shares until the bidding is over. Reading the DRHP is considered the most critical step in professional IPO due diligence."
  },
  {
    id: 'anchor-investors',
    title: 'Anchor Investors',
    category: 'IPO Basics',
    icon: Users,
    summary: "These are large institutional buyers who commit significant capital a day before the public IPO opens to build confidence. Their participation acts as a stamp of approval from the 'Smart Money' and helps stabilize the initial demand. They are subject to mandatory lock-in periods to ensure they don't exit immediately after the stock lists."
  },
  {
    id: 'asba-facility',
    title: 'ASBA Facility',
    category: 'IPO Basics',
    icon: ShieldCheck,
    summary: "Application Supported by Blocked Amount allows you to apply for IPOs without your money actually leaving your bank account. The funds are only debited if the shares are allotted to you, eliminating the risk and delay of waiting for refunds. It is now the mandatory and safest system for all public issues in the Indian market."
  },
  {
    id: 'listing-gains',
    title: 'Listing Gains Strategy',
    category: 'IPO Basics',
    icon: Zap,
    summary: "Listing gains refer to the profit made by selling shares on the very first day of trading at a premium over the issue price. Long-term strategy involves holding shares for years to benefit from the company's compounding growth and dividends. Successful investors often use a hybrid approach, selling part of the allotment to recover costs while holding the rest."
  },
  {
    id: 'gmp-vibe',
    title: 'Grey Market Premium (GMP)',
    category: 'IPO Basics',
    icon: BarChart4,
    summary: "GMP is an unofficial indicator showing the premium investors are willing to pay over the issue price before a stock officially lists. While not regulated by SEBI, it often accurately reflects market sentiment and potential listing day performance. However, investors are warned to use it cautiously as these unofficial prices can be easily manipulated."
  },
  {
    id: 'sebi-role',
    title: "SEBI: The Market 'Referee'",
    category: 'Modern Rules',
    icon: Scale,
    summary: "As the market regulator, SEBI ensures fair practices and protects the interests of individual retail investors. It drafts all market regulations, conducts investigations into fraud, and penalizes participants for insider trading. Its oversight has transformed India into one of the most trusted and transparent emerging markets in the world."
  },
  {
    id: 't3-cycle',
    title: 'T+3 Listing Cycle',
    category: 'Modern Rules',
    icon: Timer,
    summary: "India recently moved to a T+3 cycle, meaning shares now list on the exchange within just 3 working days of the IPO closing. This drastically reduces the time an investor's capital is locked and minimizes exposure to market volatility during the wait. It places India's primary market infrastructure among the fastest and most efficient globally."
  },
  {
    id: 'lot-size-logic',
    title: 'Lot Size Logic',
    category: 'Modern Rules',
    icon: Layers,
    summary: "Mainboard IPOs usually have a retail lot size worth roughly ₹15,000 to encourage wide public participation. SME IPOs have much larger lot sizes, often exceeding ₹1,00,000, to ensure only more sophisticated investors participate. This higher barrier helps manage the increased volatility and lower liquidity common in smaller company stocks."
  },
  {
    id: 'ofs-vs-fresh',
    title: 'OFS vs Fresh Issue',
    category: 'Modern Rules',
    icon: Building2,
    summary: "A Fresh Issue involves creating new shares to raise capital that goes directly into the company for growth or debt repayment. An Offer for Sale (OFS) is when existing founders or investors sell their own stakes to the public, meaning the money goes to them personally. Investors generally prefer IPOs where a higher percentage of the capital is a Fresh Issue."
  },
  {
    id: 'sme-exchange',
    title: 'SME Exchange (2012)',
    category: 'Modern Rules',
    icon: Target,
    summary: "BSE SME and NSE Emerge were launched to help small and medium enterprises raise capital without the stringent requirements of the Mainboard. These platforms provide a vital stepping stone for high-growth startups to eventually migrate to the main exchange. They offer high-risk, high-reward opportunities for investors looking beyond large-cap stocks."
  }
];

const GLOSSARY_TERMS = [
  { term: "Alpha", definition: "A measure of the active return on an investment compared to a suitable market index." },
  { term: "Arbitrage", definition: "The simultaneous purchase and sale of an asset to profit from a difference in the price." },
  { term: "Ask Price", definition: "The minimum price that a seller is willing to accept for a security." },
  { term: "Averaging Down", definition: "The process of buying more shares of a stock as its price declines to lower your average purchase price." },
  { term: "Bear Market", definition: "A condition in which securities prices fall 20% or more from recent highs amid widespread pessimism." },
  { term: "Beta", definition: "A measure of a stock's volatility in relation to the overall market." },
  { term: "Bid Price", definition: "The maximum price that a buyer is willing to pay for a security." },
  { term: "Blue Chip", definition: "A nationally recognized, well-established, and financially sound company." },
  { term: "Bonus Issue", definition: "Additional shares given to current shareholders without any additional cost, based upon the number of shares that a shareholder owns." },
  { term: "Book Value", definition: "The total value of a company's assets that shareholders would theoretically receive if a company were liquidated." },
  { term: "Broker", definition: "An individual or firm that charges a fee or commission for executing buy and sell orders submitted by an investor." },
  { term: "Bull Market", definition: "A market condition where prices are rising or are expected to rise." },
  { term: "Buyback", definition: "When a company repurchases its own outstanding shares to reduce the number of shares available on the open market." },
  { term: "Circuit Breaker", definition: "An automated regulatory measure to temporarily halt trading on an exchange to curb panic-selling." },
  { term: "Closing Price", definition: "The final price at which a security is traded on a given trading day." },
  { term: "Demat Account", definition: "An account used to hold shares and securities in electronic format." },
  { term: "Derivative", definition: "A financial security with a value that is reliant upon or derived from an underlying asset or group of assets." },
  { term: "Dividend", definition: "A portion of a company's earnings distributed to its shareholders." },
  { term: "EPS (Earnings Per Share)", definition: "A company's profit divided by the outstanding shares of its common stock." },
  { term: "ETF (Exchange Traded Fund)", definition: "A type of pooled investment security that operates much like a mutual fund but trades on an exchange." },
  { term: "Face Value", definition: "The nominal value of a security as stated by its issuer, typically used for calculating dividends." },
  { term: "FII (Foreign Institutional Investor)", definition: "An investment fund or individual from outside the country who invests in the local financial markets." },
  { term: "Free Float", definition: "The portion of a company's outstanding shares that are available to be traded by the public." },
  { term: "Futures", definition: "Financial contracts obligating the buyer to purchase an asset or the seller to sell an asset at a predetermined future date and price." },
  { term: "Gap Up/Down", definition: "When a stock opens at a significantly higher or lower price than the previous day's close with no trading in between." },
  { term: "Hedge", definition: "An investment made with the intention of reducing the risk of adverse price movements in an asset." },
  { term: "Index", definition: "A method to track the performance of a group of assets in a standardized way, like the Nifty 50." },
  { term: "IPO (Initial Public Offering)", definition: "The process of offering shares of a private corporation to the public in a new stock issuance." },
  { term: "Large Cap", definition: "Companies with a market capitalization of over ₹20,000 crores in the Indian context." },
  { term: "Leverage", definition: "Using borrowed capital to increase the potential return of an investment." },
  { term: "Limit Order", definition: "An order to buy or sell a stock at a specific price or better." },
  { term: "Liquidity", definition: "The ease with which an asset or security can be converted into ready cash without affecting its market price." },
  { term: "Long Position", definition: "Buying a security with the expectation that it will rise in value over time." },
  { term: "Market Cap", definition: "The total market value of a company's outstanding shares of stock." },
  { term: "Mid Cap", definition: "Companies with a market capitalization between ₹5,000 crores and ₹20,000 crores." },
  { term: "Multi-bagger", definition: "An equity investment which gives returns that are several times its cost." },
  { term: "Mutual Fund", definition: "A professionally managed investment program funded by shareholders that trades in diversified holdings." },
  { term: "Nifty 50", definition: "The benchmark stock market index for the National Stock Exchange (NSE)." },
  { term: "Options", definition: "Financial instruments that give the buyer the right, but not the obligation, to buy or sell an asset at a set price." },
  { term: "P/E Ratio", definition: "A valuation ratio of a company's current share price compared to its per-share earnings." },
  { term: "Penny Stock", definition: "Stocks that trade at a very low price and have very low market capitalization." },
  { term: "Portfolio", definition: "A grouping of financial assets such as stocks, bonds, commodities, and cash equivalents." },
  { term: "Resistance", definition: "A price level where a rising stock price encounters selling pressure that stops it from rising further." },
  { term: "Rights Issue", definition: "An invitation to existing shareholders to purchase additional new shares in the company." },
  { term: "ROE (Return on Equity)", definition: "A measure of financial performance calculated by dividing net income by shareholders' equity." },
  { term: "Sensex", definition: "The benchmark stock market index of the Bombay Stock Exchange (BSE)." },
  { term: "Short Position", definition: "The sale of a borrowed security with the expectation that its price will fall, allowing it to be bought back cheaper." },
  { term: "Small Cap", definition: "Companies with a market capitalization of less than ₹5,000 crores." },
  { term: "Stop Loss", definition: "An order placed with a broker to buy or sell a specific stock once the stock reaches a certain price to limit loss." },
  { term: "Support", definition: "A price level where a declining stock price tends to find buying interest and stops falling." },
  { term: "Volatility", definition: "A statistical measure of the dispersion of returns for a given security or market index." },
  { term: "Yield", definition: "The earnings generated and realized on an investment over a particular period of time." }
];

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const ALL_QUIZ_QUESTIONS: Question[] = [
  { id: 1, question: "In what year was the Native Share & Stock Brokers' Association (now BSE) established?", options: ["1850", "1875", "1901", "1956"], correctAnswer: 1, explanation: "The BSE was established in 1875 as the first formal stock exchange in Asia." },
  { id: 2, question: "What does 'DRHP' stand for in the IPO process?", options: ["Direct Revenue High Profit", "Digital Record of Holding Portfolio", "Draft Red Herring Prospectus", "Daily Return on Holding Price"], correctAnswer: 2, explanation: "The DRHP is a preliminary registration document that contains all company details but omits final price information." },
  { id: 3, question: "Which body acts as the 'Referee' of the Indian Stock Market?", options: ["RBI", "NSE", "BSE", "SEBI"], correctAnswer: 3, explanation: "SEBI (Securities and Exchange Board of India) is the primary regulator for the securities market." },
  { id: 4, question: "When did India move from physical share certificates to digital Demat accounts?", options: ["1991", "1996", "2000", "2008"], correctAnswer: 1, explanation: "The Depositories Act, 1996 enabled the transition to dematerialized (Demat) shareholding." },
  { id: 5, question: "What is the main difference between a Mainboard and an SME IPO?", options: ["Company age", "Number of employees", "Minimum investment/Lot size", "The currency used"], correctAnswer: 2, explanation: "SME IPOs have a much higher minimum investment (usually ₹1 Lakh+) compared to Mainboard IPOs (~₹15,000)." },
  { id: 6, question: "What does 'GMP' stand for?", options: ["Gross Margin Percentage", "General Market Price", "Grey Market Premium", "Global Monitored Portfolio"], correctAnswer: 2, explanation: "GMP refers to the premium at which shares trade in the unofficial market before listing." },
  { id: 7, question: "Which year is known for the major Liberalization of the Indian Economy?", options: ["1947", "1972", "1991", "1999"], correctAnswer: 2, explanation: "The 1991 reforms opened the Indian economy to global trade and private competition." },
  { id: 8, question: "What is the full form of 'ASBA'?", options: ["Account Supported by Banking Apps", "Application Supported by Blocked Amount", "Annual Stock Board Audit", "Automated Share Buying Authority"], correctAnswer: 1, explanation: "ASBA allows your application money to stay in your bank account, blocked, until share allotment is confirmed." },
  { id: 9, question: "Which exchange was established in 1992 to introduce electronic trading to India?", options: ["BSE", "NSE", "MCX", "NCDEX"], correctAnswer: 1, explanation: "The National Stock Exchange (NSE) brought nationwide, screen-based automated trading in 1992." },
  { id: 10, question: "What is the current standard 'Listing Cycle' for IPOs in India?", options: ["T+1", "T+3", "T+6", "T+10"], correctAnswer: 1, explanation: "SEBI has mandated the T+3 timeline for listing shares after the IPO closes." },
  { id: 11, question: "Which index represents the performance of the National Stock Exchange (NSE)?", options: ["Sensex", "Nifty 50", "NCDEX", "Gold Index"], correctAnswer: 1, explanation: "Nifty 50 is the flagship index of the NSE, tracking the top 50 companies." },
  { id: 12, question: "Which index represents the performance of the Bombay Stock Exchange (BSE)?", options: ["Nifty 50", "Sensex", "S&P 500", "MSCI"], correctAnswer: 1, explanation: "Sensex (Sensitive Index) is the benchmark index for the BSE, tracking 30 prominent companies." },
  { id: 13, question: "In market terms, what does a 'Bull' represent?", options: ["Falling prices", "Rising prices", "Stagnant market", "Closing bell"], correctAnswer: 1, explanation: "A Bull is an investor who expects prices to rise (attacking upward)." },
  { id: 14, question: "What is the typical lock-in period for Anchor Investors in an IPO for 50% of their holding?", options: ["1 day", "30 days", "1 year", "3 years"], correctAnswer: 1, explanation: "Anchor investors have a 30-day lock-in period for 50% of their shares to ensure market stability." },
  { id: 15, question: "What happens in a 'Fresh Issue' part of an IPO?", options: ["Existing owners sell shares", "New shares are issued to raise capital", "The company buys back shares", "Dividends are distributed"], correctAnswer: 1, explanation: "A Fresh Issue involves creating and selling new shares to bring growth capital into the company." },
  { id: 16, question: "What does 'OFS' stand for in an IPO?", options: ["Only Fresh Shares", "Offer for Sale", "Owned Financial Sector", "Open Fund System"], correctAnswer: 1, explanation: "OFS (Offer for Sale) allows existing shareholders to sell their stakes to the public." },
  { id: 17, question: "What is the approximate minimum investment amount for a retail lot in a Mainboard IPO?", options: ["₹1,000", "₹5,000", "₹15,000", "₹50,000"], correctAnswer: 2, explanation: "Most retail lots are priced between ₹14,000 and ₹15,000 to maintain accessibility." },
  { id: 18, question: "Which of these is the most influential 'Legendary' scam that led to SEBI gaining statutory powers?", options: ["Harshad Mehta (1992)", "Ketan Parekh (2001)", "Satyam (2009)", "Nirav Modi (2018)"], correctAnswer: 0, explanation: "The 1992 Harshad Mehta securities scam was the catalyst for empowering SEBI." },
  { id: 19, question: "What is the price at which a stock finishes its first day of trading called?", options: ["Issue Price", "Closing Price", "Face Value", "Cut-off Price"], correctAnswer: 1, explanation: "The Closing Price is the last traded price of the security at the end of the market hours." },
  { id: 20, question: "Who is allowed to bid in the RII (Retail Individual Investor) category?", options: ["Institutions only", "Investors bidding up to ₹2 Lakh", "Foreign Banks", "The Promoters"], correctAnswer: 1, explanation: "Retail Individual Investors are those applying for up to ₹2,00,000 in an IPO." }
];

const IPOAcademy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [academyMode, setAcademyMode] = useState<'topics' | 'quiz' | 'glossary'>('topics');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryLetter, setGlossaryLetter] = useState('All');

  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const categories = ['All', 'History', 'Milestones', 'Legends', 'IPO Basics', 'Modern Rules'];
  const alphabets = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredTopics = useMemo(() => {
    if (activeCategory === 'All') return MARKET_TOPICS;
    return MARKET_TOPICS.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const filteredGlossary = useMemo(() => {
    return GLOSSARY_TERMS.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(glossarySearch.toLowerCase());
      const matchesLetter = glossaryLetter === 'All' || item.term.startsWith(glossaryLetter);
      return matchesSearch && matchesLetter;
    });
  }, [glossarySearch, glossaryLetter]);

  const shuffleQuestions = () => {
    const shuffled = [...ALL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === shuffledQuestions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const startQuizFlow = () => {
    shuffleQuestions();
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
    setAcademyMode('quiz');
  };

  const resetQuiz = () => {
    startQuizFlow();
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (isAnswered ? 1 : 0)) / (shuffledQuestions.length || 1)) * 100;

  const getGrade = (s: number) => {
    if (s === 20) return { title: "Market Legend", desc: "You have absolute mastery over the Indian Stock Market!", color: "text-emerald-500" };
    if (s >= 15) return { title: "Market Pro", desc: "Impressive knowledge. You're ready to navigate the markets!", color: "text-blue-500" };
    if (s >= 10) return { title: "Savvy Investor", desc: "Good grasp of the basics, keep studying!", color: "text-amber-500" };
    return { title: "Rookie Investor", desc: "Keep studying the topics to improve!", color: "text-slate-500" };
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <header className="mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-600 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20 shadow-lg w-fit"
              >
                <ArrowLeft size={16} strokeWidth={3} />
                Back to Dashboard
              </button>
              <div className="space-y-2">
                <h2 className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Academy</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-xl max-w-xl">
                  {academyMode === 'glossary' ? 'The ultimate A-Z of Indian stock market terms.' : 'The history, mechanics, and legends of the Indian primary market.'}
                </p>
              </div>
            </div>

            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <button 
                onClick={() => setAcademyMode('topics')}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${academyMode === 'topics' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
              >
                Learn
              </button>
              <button 
                onClick={() => setAcademyMode('glossary')}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${academyMode === 'glossary' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
              >
                Glossary
              </button>
              <button 
                onClick={startQuizFlow}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${academyMode === 'quiz' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
              >
                Quiz
              </button>
            </div>
          </div>
        </header>

        {academyMode === 'topics' && (
          <div className="space-y-12">
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full mb-8">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic, idx) => (
                <div 
                  key={topic.id}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  onClick={() => setExpandedTopicId(expandedTopicId === topic.id ? null : topic.id)}
                  className={`group relative overflow-hidden p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border transition-all duration-500 cursor-pointer animate-fade-in-up flex flex-col ${
                    expandedTopicId === topic.id 
                      ? 'border-emerald-500 shadow-2xl scale-[1.02]' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">
                      {topic.category}
                    </span>
                    <div className={`p-3 rounded-2xl border transition-all duration-500 ${
                      expandedTopicId === topic.id 
                        ? 'bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-emerald-500 group-hover:scale-110'
                    }`}>
                      <topic.icon size={24} />
                    </div>
                  </div>
                  
                  <h3 className={`text-2xl font-black mb-3 tracking-tight transition-colors ${
                    expandedTopicId === topic.id ? 'text-emerald-500' : 'text-slate-900 dark:text-white group-hover:text-emerald-500'
                  }`}>
                    {topic.title}
                  </h3>
                  
                  <div className={`transition-all duration-500 overflow-hidden ${
                    expandedTopicId === topic.id ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                      {topic.summary}
                    </p>
                  </div>
                  
                  {!expandedTopicId && (
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <ChevronRight size={14} /> Expand to Read
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {academyMode === 'glossary' && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
                <input 
                  type="text" 
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Search terms (e.g. Dividend, P/E Ratio)..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 pl-16 rounded-[2.5rem] font-bold text-lg dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>

              <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar w-full lg:w-fit shadow-sm">
                {alphabets.map(letter => (
                  <button 
                    key={letter}
                    onClick={() => setGlossaryLetter(letter)}
                    className={`min-w-[40px] h-10 flex items-center justify-center text-[10px] font-black uppercase rounded-xl transition-all ${glossaryLetter === letter ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGlossary.length > 0 ? filteredGlossary.map((item, idx) => (
                <div 
                  key={item.term} 
                  style={{ animationDelay: `${idx * 20}ms` }}
                  className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-emerald-500 transition-all duration-300 animate-fade-in-up"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <Book size={20} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {item.term}
                    </h4>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.definition}
                  </p>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center">
                  <Book size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
                  <p className="text-xl font-black text-slate-400 uppercase tracking-widest">No terms found matching your search</p>
                </div>
              )}
            </div>
          </div>
        )}

        {academyMode === 'quiz' && (
          <div className="lg:col-span-3 max-w-4xl mx-auto w-full animate-fade-in-up">
            {showResults ? (
              <div className="p-12 sm:p-20 rounded-[4rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl text-center animate-fade-in-up max-w-4xl mx-auto">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Trophy size={48} className="text-emerald-500" />
                </div>
                <h3 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Quiz Complete!</h3>
                <div className="mb-10">
                   <p className={`text-3xl font-black uppercase tracking-widest ${getGrade(score).color} mb-2`}>{getGrade(score).title}</p>
                   <p className="text-slate-500 dark:text-slate-400 font-medium">{getGrade(score).desc}</p>
                </div>
                <p className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-12">
                  Final Score: <span className="text-emerald-500 text-4xl px-2">{score}</span> / {shuffledQuestions.length}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={resetQuiz} className="flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 w-full sm:w-auto">
                    <RotateCcw size={18} /> Re-Shuffle
                  </button>
                  <button onClick={() => setAcademyMode('topics')} className="px-10 py-5 border border-slate-200 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 w-full sm:w-auto">
                    Back to Topics
                  </button>
                </div>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-8">
                <div className="mb-8 space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Market Mastery Test</p>
                    <p className="text-sm font-black text-emerald-500">Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</p>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-10 leading-tight">
                    {currentQuestion.question}
                  </h4>

                  <div className="grid grid-cols-1 gap-4 mb-10">
                    {currentQuestion.options.map((option, idx) => {
                      let btnClass = "w-full p-6 text-left rounded-3xl border-2 font-bold transition-all flex items-center justify-between group ";
                      if (isAnswered) {
                        if (idx === currentQuestion.correctAnswer) btnClass += "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 ";
                        else if (idx === selectedOption) btnClass += "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 ";
                        else btnClass += "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-400 opacity-50 ";
                      } else {
                        btnClass += "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-200 hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-850 ";
                      }
                      return (
                        <button key={idx} disabled={isAnswered} onClick={() => handleOptionSelect(idx)} className={btnClass}>
                          <span className="flex-1">{option}</span>
                          {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle2 size={24} className="text-emerald-500 animate-in zoom-in duration-300" />}
                          {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle size={24} className="text-rose-500 animate-in shake-in duration-300" />}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                      <div className={`p-6 rounded-3xl flex gap-4 ${selectedOption === currentQuestion.correctAnswer ? 'bg-emerald-500/5 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/5 text-rose-600 border border-rose-500/20'}`}>
                        <Info size={24} className="flex-shrink-0" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">{selectedOption === currentQuestion.correctAnswer ? 'Correct' : 'Insight'}</p>
                            <p className="text-sm font-medium leading-relaxed">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                      <button onClick={handleNext} className="w-full py-6 bg-slate-900 dark:bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3">
                        {currentQuestionIndex === shuffledQuestions.length - 1 ? "Show Final Grade" : "Next Challenge"} <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
        
        <footer className="mt-20 text-center pb-12">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
            Educational Purpose Only • © 2025 Terminal Terminal
          </p>
        </footer>
      </div>
    </div>
  );
};

export default IPOAcademy;
