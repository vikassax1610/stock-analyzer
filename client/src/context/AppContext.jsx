import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [recentSignals, setRecentSignals] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const addRecentSignal = useCallback((signal) => {
    setRecentSignals(prev => {
      const filtered = prev.filter(s => s.symbol !== signal.symbol);
      return [signal, ...filtered].slice(0, 10);
    });
  }, []);

  const addToWatchlist = useCallback((stock) => {
    setWatchlist(prev => {
      if (prev.find(s => s.symbol === stock.symbol)) return prev;
      return [stock, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
  }, []);

  const isInWatchlist = useCallback((symbol) => {
    return watchlist.some(s => s.symbol === symbol);
  }, [watchlist]);

  const addSearchHistory = useCallback((symbol) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(s => s !== symbol);
      return [symbol, ...filtered].slice(0, 10);
    });
  }, []);

  return (
    <AppContext.Provider value={{
      recentSignals,
      addRecentSignal,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      searchHistory,
      addSearchHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};
