import { useState, useEffect, useCallback } from 'react';
import { fetchWatchlist, addToWatchlistAPI, removeFromWatchlistAPI } from '../services/api';

/**
 * useWatchlist — syncs watchlist state with the server.
 */
const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWatchlist();
      setWatchlist(res.data || []);
    } catch {
      // DB may not be available — silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (symbol, companyName = '') => {
    try {
      await addToWatchlistAPI(symbol, companyName);
      setWatchlist(prev => {
        if (prev.find(s => s.symbol === symbol)) return prev;
        return [{ symbol, companyName }, ...prev];
      });
    } catch (err) {
      console.error('Watchlist add error:', err.message);
    }
  }, []);

  const remove = useCallback(async (symbol) => {
    try {
      await removeFromWatchlistAPI(symbol);
      setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
    } catch (err) {
      console.error('Watchlist remove error:', err.message);
    }
  }, []);

  const isWatched = useCallback((symbol) =>
    watchlist.some(s => s.symbol === symbol), [watchlist]);

  return { watchlist, loading, add, remove, isWatched, refresh: load };
};

export default useWatchlist;
