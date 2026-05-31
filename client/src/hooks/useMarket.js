import { useState, useEffect, useCallback } from 'react';
import { fetchMarketOverview, fetchMovers } from '../services/api';

/**
 * useMarket — fetches market overview (indices) and top movers.
 * Auto-refreshes every 5 minutes.
 */
const useMarket = () => {
  const [overview, setOverview] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, moversRes] = await Promise.allSettled([
        fetchMarketOverview(),
        fetchMovers(10),
      ]);

      if (overviewRes.status === 'fulfilled') {
        setOverview(overviewRes.value.data || []);
      }
      if (moversRes.status === 'fulfilled') {
        setGainers(moversRes.value.data?.gainers || []);
        setLosers(moversRes.value.data?.losers || []);
      }
      if (overviewRes.status === 'rejected' && moversRes.status === 'rejected') {
        setError('Failed to load market data');
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { overview, gainers, losers, loading, error, lastUpdated, refresh: fetchAll };
};

export default useMarket;
