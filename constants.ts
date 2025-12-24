
import { IPO, TickerItem } from './types';

export const MOCK_IPO_DATA: IPO[] = [
  { 
    id: '1',
    name: "Shyam Dhani Industries", 
    type: "SME", 
    status: "Open", 
    priceBand: "₹70", 
    gmp: 62, 
    subscription: "45.2x",
    lotSize: 2000,
    sector: "Logistics"
  },
  { 
    id: '2',
    name: "Gujarat Kidney & Super Speciality", 
    type: "Mainboard", 
    status: "Open", 
    priceBand: "₹108 - ₹114", 
    gmp: 5, 
    subscription: "1.2x",
    lotSize: 128,
    sector: "Healthcare"
  },
  { 
    id: '3',
    name: "Dhara Rail Projects", 
    type: "SME", 
    status: "Upcoming", 
    priceBand: "₹120 - ₹126", 
    gmp: 15, 
    subscription: "N/A",
    lotSize: 1000,
    sector: "Infrastructure"
  },
  { 
    id: '4',
    name: "ICICI Prudential AMC", 
    type: "Mainboard", 
    status: "Closed", 
    priceBand: "₹2165", 
    gmp: 450, 
    subscription: "25.4x",
    lotSize: 7,
    sector: "Finance"
  }
];

export const TABS = [
  { id: 'Open', label: 'Live Now' },
  { id: 'Upcoming', label: 'Upcoming' },
  { id: 'Closed', label: 'Recently Closed' }
] as const;

export const TICKER_DATA: TickerItem[] = [
  { label: 'NIFTY 50', value: '26,142.20', change: '-0.13%', trend: 'down' },
  { label: 'SENSEX', value: '85,413.60', change: '-0.13%', trend: 'down' },
  { label: 'GOLD', value: '₹75,200', change: '+0.45%', trend: 'up' },
  { label: 'SILVER', value: '₹92,100', change: '+1.20%', trend: 'up' },
  { label: 'USD/INR', value: '84.02', change: '+0.02%', trend: 'up' },
];
