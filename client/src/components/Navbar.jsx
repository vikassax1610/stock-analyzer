import { Link, useNavigate } from 'react-router-dom';
import Container from './ui/Container';

const Navbar = () => {
  const navigate = useNavigate();

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

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Dashboard' },
              { to: '/watchlist', label: 'Watchlist' },
              { to: '/history', label: 'History' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-1.5 rounded-[var(--radius-sm)] text-sm text-text-secondary hover:text-text hover:bg-card transition-all duration-[var(--transition)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              Live
            </div>
            <span className="text-xs text-text-muted hidden sm:block">NSE · BSE</span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
