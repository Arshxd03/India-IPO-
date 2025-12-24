
export type IPOStatus = 'Open' | 'Upcoming' | 'Closed';
export type IPOType = 'Mainboard' | 'SME';
export type AppView = 'tracker' | 'academy';

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
