import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Disclaimer from './components/Disclaimer';
import { PageLoader } from './components/ui/Loader';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages for code splitting
const HomePage      = lazy(() => import('./pages/HomePage'));
const AnalysisPage  = lazy(() => import('./pages/AnalysisPage'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'));
const HistoryPage   = lazy(() => import('./pages/HistoryPage'));
const LoginPage     = lazy(() => import('./pages/LoginPage'));
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen flex flex-col bg-bg text-text font-sans">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Suspense fallback={<PageLoader text="Loading..." />}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/"                   element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/analysis/:symbol"   element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
                  <Route path="/watchlist"          element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
                  <Route path="/history"            element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                  <Route path="*"                   element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Disclaimer />
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
