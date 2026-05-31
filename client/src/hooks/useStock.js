import { useState, useCallback } from 'react';
import { fetchStockSignal } from '../services/api';
import { useAppContext } from '../context/AppContext';

/**
 * useStock — fetches and caches a trading signal for a stock symbol.
 */
const useStock = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addRecentSignal, addSearchHistory } = useAppContext();

  const analyze = useCallback(async (symbol) => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetchStockSignal(symbol);
      const signalData = response.data;
      setData(signalData);
      addRecentSignal(signalData);
      addSearchHistory(symbol.toUpperCase());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [addRecentSignal, addSearchHistory]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, analyze, reset };
};

export default useStock;
