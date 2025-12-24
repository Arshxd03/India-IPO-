
import { MOCK_IPO_DATA } from '../constants';
import { IPO } from '../types';
import { fetchLiveIPOs } from './geminiService';

const CACHE_KEY = 'ipo_data_cache';
const TS_KEY = 'ipo_data_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour in milliseconds

/**
 * Fetches IPO data with a strict 1-hour persistence layer.
 * Bypasses network if cache is fresh unless forceRefresh is true.
 */
export const fetchIPOs = async (forceRefresh: boolean = false): Promise<IPO[]> => {
  const now = Date.now();
  
  // 1. Check LocalStorage for fresh cache (unless forced)
  if (!forceRefresh) {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTs = localStorage.getItem(TS_KEY);
    
    if (cachedData && cachedTs) {
      const age = now - parseInt(cachedTs);
      if (age < CACHE_DURATION) {
        console.debug(`Serving fresh cache (${Math.round(age / 60000)} mins old)`);
        return JSON.parse(cachedData);
      }
    }
  }

  // 2. Proceed with API Call (Cache is old or missing or forced)
  try {
    const liveData = await fetchLiveIPOs();
    
    if (liveData && liveData.length > 0) {
      // Update Cache & Timestamp
      localStorage.setItem(CACHE_KEY, JSON.stringify(liveData));
      localStorage.setItem(TS_KEY, Date.now().toString());
      return liveData;
    }
    
    // Fallback if API returns empty
    throw new Error("No live data available");
  } catch (error: any) {
    // 3. Handle Quota/Error: Serve stale cache as last resort
    const staleData = localStorage.getItem(CACHE_KEY);
    
    if (staleData) {
      console.warn("API Error/Limit. Serving stale cache.");
      const data = JSON.parse(staleData).map((i: IPO) => ({ ...i, isLive: false }));
      
      if (error?.message?.includes('429')) {
        (error as any).fallbackData = data;
        throw error;
      }
      return data;
    }
    
    // Ultimate fallback to Mocks if absolutely no cache exists
    return MOCK_IPO_DATA.map(i => ({ ...i, isLive: false }));
  }
};
