export type IPOStatus = 'Open' | 'Upcoming' | 'Closed' | 'Listed';
export type IPOType = 'Mainboard' | 'SME';
export type AppView = 'tracker' | 'academy' | 'tools';

export interface IPO {
  id: string;
  name: string;
  priceBand: string;
  lotSize: number;
  gmp: number;
  subscription: string;
  status: IPOStatus;
  type: IPOType;
  // Extended fields for richer UI and compliance
  sector?: string;
  openDate?: string;
  closeDate?: string;
  groundingSources?: { title: string; uri: string }[];
  isLive?: boolean;
  // Performance fields for Recently Listed tab
  issuePrice?: number;
  listingPrice?: number;
  currentPrice?: number;
  returns?: number;
}

export interface InvestmentDetails {
  companyName: string;
  lotSize: number;
  minPrice: number;
  maxPrice: number;
}

export interface TickerItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}