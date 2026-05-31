import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Disclaimer from './components/Disclaimer';
import { PageLoader } from './components/ui/Loader';

// Lazy-loaded pages for code splitting
const HomePage      = lazy(() => import('./pages/HomePage'));
const AnalysisPage  = lazy(() => import('./pages/AnalysisPage'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'));
const HistoryPage   = lazy(() => import('./pages/HistoryPage'));
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-bg text-text font-sans">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Suspense fallback={<PageLoader text="Loading..." />}>
              <Routes>
                <Route path="/"                   element={<HomePage />} />
                <Route path="/analysis/:symbol"   element={<AnalysisPage />} />
                <Route path="/watchlist"          element={<WatchlistPage />} />
                <Route path="/history"            element={<HistoryPage />} />
                <Route path="*"                   element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Disclaimer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
