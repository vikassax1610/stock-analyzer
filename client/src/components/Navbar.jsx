import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from './ui/Container';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/watchlist', label: 'Watchlist' },
    { to: '/history', label: 'History' },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-shadow duration-[var(--transition)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-text tracking-tight">StockSignal</span>
            </div>
          </Link>

          {/* Nav Links — Desktop only */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm transition-all duration-[var(--transition)] ${isActive
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-text-secondary hover:text-text hover:bg-card'
                      }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Actions: Live indicator & Logout (Desktop) & Menu Trigger (Mobile) */}
          <div className="flex items-center gap-3">
            {/* Live Indicator (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                Live
              </div>
              <span className="text-xs text-text-muted">NSE · BSE</span>
            </div>

            {/* Logout Button (Desktop only) */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden md:flex px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-danger hover:bg-danger/10 border border-border hover:border-danger/30 rounded-[var(--radius-sm)] transition-all duration-[var(--transition)] cursor-pointer items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            {user && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
                className="md:hidden w-9 h-9 flex items-center justify-center text-text-secondary hover:text-text hover:bg-card border border-border rounded-[var(--radius-sm)] transition-all duration-[var(--transition)] cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Menu Panel */}
      {user && isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-99 bg-black backdrop-blur-xl animate-fade-in flex flex-col border-t border-border">
          <nav className="flex-1 px-6 py-8 flex flex-col gap-3 bg-black">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-3.5 rounded-[var(--radius)] text-base font-medium transition-all duration-[var(--transition)] flex items-center justify-between ${isActive
                      ? 'text-primary bg-primary/10 shadow-[inset_4px_0_0_var(--primary)] pl-5'
                      : 'text-text-secondary hover:text-text hover:bg-card'
                    }`}
                >
                  <span>{label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-border bg-black flex flex-col gap-4">
            {/* Live Indicator (Mobile footer status) */}
            <div className="flex items-center justify-between text-xs text-text-muted px-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                Market Status: Active
              </div>
              <span>NSE · BSE</span>
            </div>

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3.5 px-4 font-semibold text-sm text-danger hover:text-white bg-danger/10 hover:bg-danger border border-danger/30 hover:border-danger rounded-[var(--radius)] transition-all duration-[var(--transition)] cursor-pointer flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout Terminal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
