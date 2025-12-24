
import { MOCK_IPO_DATA } from '../constants';
import { IPO } from '../types';
import { fetchLiveIPOs } from './geminiService';

const CACHE_KEY = 'ipo_data_cache';
const TS_KEY = 'ipo_data_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes for quota preservation

/**
 * Fetches IPO data from the source with a 60-minute persistence layer.
 * Strictly checks localStorage to prevent unnecessary Gemini API calls.
 */
export const fetchIPOs = async (forceRefresh: boolean = false): Promise<IPO[]> => {
  const now = Date.now();
  
  if (!forceRefresh) {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTs = localStorage.getItem(TS_KEY);
    
    if (cachedData && cachedTs) {
      const age = now - parseInt(cachedTs);
      if (age < CACHE_DURATION) {
        console.debug(`Serving from cache. Age: ${Math.round(age / 60000)} mins`);
        return JSON.parse(cachedData);
      }
    }
  }

  try {
    // Attempt to get live data from Gemini Search
    const liveData = await fetchLiveIPOs();
    
    if (liveData && liveData.length > 0) {
      // Persist successful fetch
      localStorage.setItem(CACHE_KEY, JSON.stringify(liveData));
      localStorage.setItem(TS_KEY, now.toString());
      return liveData;
    }
    
    return MOCK_IPO_DATA;
  } catch (error) {
    console.warn("Falling back to local data/mock due to error:", error);
    
    // If API fails, try to return stale cache as a last resort before mock
    const staleData = localStorage.getItem(CACHE_KEY);
    if (staleData) return JSON.parse(staleData);
    
    return MOCK_IPO_DATA;
  }
};
