import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import SearchBar from '../components/SearchBar';
import MarketOverview from '../components/MarketOverview';
import GainersLosers from '../components/GainersLosers';
import RecentSignals from '../components/RecentSignals';
import SignalCard from '../components/SignalCard';
import TopPicks from '../components/TopPicks';
import { SignalSkeleton } from '../components/ui/Loader';
import useMarket from '../hooks/useMarket';
import useStock from '../hooks/useStock';

const HomePage = () => {
  const navigate = useNavigate();
  const { overview, gainers, losers, loading: marketLoading } = useMarket();
  const { data: signal, loading: signalLoading, error: signalError, analyze, reset } = useStock();

  const handleAnalyze = useCallback((symbol) => {
    analyze(symbol);
    // Scroll to signal area on mobile
    setTimeout(() => {
      document.getElementById('signal-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [analyze]);

  const handleSelectStock = useCallback((symbol) => {
    navigate(`/analysis/${symbol}`);
  }, [navigate]);

  return (
    <div className="flex-1 py-6">
      <Container>
        <div className="space-y-8">

          {/* ── Hero Search ── */}
          <div className="text-center space-y-4 py-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-text tracking-tight">
              Indian Stock Signal Platform
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
              Get real-time BUY / SELL / HOLD signals powered by EMA, RSI, MACD & volume analysis.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar onAnalyze={handleAnalyze} />
            </div>
          </div>

          {/* ── Signal Result ── */}
          <div id="signal-section">
            {signalLoading && <SignalSkeleton />}
            {signalError && !signalLoading && (
              <div className="card-base p-6 border-danger/30 bg-danger/5 animate-fade-in">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger flex-shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-danger">Analysis Failed</p>
                    <p className="text-xs text-text-secondary mt-0.5">{signalError}</p>
                  </div>
                  <button onClick={reset} className="ml-auto text-text-muted hover:text-text text-xs underline">Dismiss</button>
                </div>
              </div>
            )}
            {signal && !signalLoading && (
              <SignalCard data={signal} onReset={reset} />
            )}
          </div>

          {/* ── Market Overview ── */}
          <MarketOverview data={overview} loading={marketLoading} />

          {/* ── Top 10 Stocks to Buy ── */}
          <TopPicks />

          {/* ── Gainers / Losers + Recent Signals ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <GainersLosers
                gainers={gainers}
                losers={losers}
                loading={marketLoading}
                onSelectStock={handleSelectStock}
              />
            </div>
            <div>
              <RecentSignals onSelectStock={handleSelectStock} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
