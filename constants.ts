import { IPO, TickerItem } from './types';

export const RECENTLY_LISTED_DATA: IPO[] = [
  { 
    id: 'l1', name: "Waaree Energies", type: "Mainboard", status: "Listed", 
    priceBand: "₹1503", issuePrice: 1503, listingPrice: 2550, currentPrice: 2980, 
    returns: 98.27, lotSize: 9, sector: "Renewable Energy", gmp: 0, subscription: "76.3x" 
  },
  { 
    id: 'l2', name: "Afcons Infrastructure", type: "Mainboard", status: "Listed", 
    priceBand: "₹463", issuePrice: 463, listingPrice: 430, currentPrice: 485, 
    returns: 4.75, lotSize: 32, sector: "Infrastructure", gmp: 0, subscription: "2.6x" 
  },
  { 
    id: 'l3', name: "Swiggy Ltd", type: "Mainboard", status: "Listed", 
    priceBand: "₹390", issuePrice: 390, listingPrice: 420, currentPrice: 410, 
    returns: 5.12, lotSize: 38, sector: "E-commerce", gmp: 0, subscription: "3.6x" 
  },
  { 
    id: 'l4', name: "Hyundai Motor India", type: "Mainboard", status: "Listed", 
    priceBand: "₹1960", issuePrice: 1960, listingPrice: 1934, currentPrice: 1840, 
    returns: -6.12, lotSize: 7, sector: "Automobile", gmp: 0, subscription: "2.3x" 
  },
  { 
    id: 'l5', name: "Sagility India", type: "Mainboard", status: "Listed", 
    priceBand: "₹30", issuePrice: 30, listingPrice: 31, currentPrice: 34, 
    returns: 13.33, lotSize: 500, sector: "Healthcare IT", gmp: 0, subscription: "3.2x" 
  },
  { 
    id: 'l6', name: "KRN Heat Exchanger", type: "Mainboard", status: "Listed", 
    priceBand: "₹220", issuePrice: 220, listingPrice: 480, currentPrice: 590, 
    returns: 168.18, lotSize: 65, sector: "Manufacturing", gmp: 0, subscription: "213.4x" 
  },
  { 
    id: 'l7', name: "Zinka Logistics", type: "Mainboard", status: "Listed", 
    priceBand: "₹273", issuePrice: 273, listingPrice: 273, currentPrice: 260, 
    returns: -4.76, lotSize: 54, sector: "Logistics", gmp: 0, subscription: "1.9x" 
  },
  { 
    id: 'l8', name: "Acme Solar Holdings", type: "Mainboard", status: "Listed", 
    priceBand: "₹289", issuePrice: 289, listingPrice: 251, currentPrice: 242, 
    returns: -16.26, lotSize: 51, sector: "Solar Energy", gmp: 0, subscription: "2.8x" 
  }
];

export const MOCK_IPO_DATA: IPO[] = [
  { 
    id: '1', name: "Shyam Dhani Industries", type: "SME", status: "Open", 
    priceBand: "₹70", gmp: 62, subscription: "45.2x", lotSize: 2000, sector: "Logistics"
  },
  { 
    id: '2', name: "Gujarat Kidney & Super Speciality", type: "Mainboard", status: "Open", 
    priceBand: "₹108 - ₹114", gmp: 5, subscription: "1.2x", lotSize: 128, sector: "Healthcare"
  },
  { 
    id: '3', name: "Dhara Rail Projects", type: "SME", status: "Upcoming", 
    priceBand: "₹120 - ₹126", gmp: 15, subscription: "N/A", lotSize: 1000, sector: "Infrastructure"
  },
  { 
    id: '4', name: "ICICI Prudential AMC", type: "Mainboard", status: "Closed", 
    priceBand: "₹2165", gmp: 450, subscription: "25.4x", lotSize: 7, sector: "Finance"
  }
];

export const TABS = [
  { id: 'Open', label: 'Live Now' },
  { id: 'Upcoming', label: 'Upcoming' },
  { id: 'Closed', label: 'Recently Closed' },
  { id: 'Listed', label: 'Recently Listed' }
] as const;

export const TICKER_DATA: TickerItem[] = [
  { label: 'NIFTY 50', value: '26,142.20', change: '-0.13%', trend: 'down' },
  { label: 'SENSEX', value: '85,413.60', change: '-0.13%', trend: 'down' },
  { label: 'GOLD', value: '₹75,200', change: '+0.45%', trend: 'up' },
  { label: 'SILVER', value: '₹92,100', change: '+1.20%', trend: 'up' },
  { label: 'USD/INR', value: '84.02', change: '+0.02%', trend: 'up' },
];