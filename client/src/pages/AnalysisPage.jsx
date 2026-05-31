import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import SignalCard from '../components/SignalCard';
import { SignalSkeleton } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import useStock from '../hooks/useStock';

const AnalysisPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, analyze } = useStock();

  useEffect(() => {
    if (symbol) analyze(symbol);
  }, [symbol]);

  return (
    <div className="flex-1 py-6">
      <Container maxWidth="max-w-3xl">
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← Back to Dashboard
          </Button>
        </div>

        {loading && <SignalSkeleton />}

        {error && !loading && (
          <div className="card-base p-8 text-center border-danger/20">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-danger mx-auto mb-3">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-danger font-semibold mb-1">Analysis Failed</p>
            <p className="text-text-secondary text-sm mb-4">{error}</p>
            <Button variant="primary" onClick={() => analyze(symbol)}>Retry</Button>
          </div>
        )}

        {data && !loading && (
          <SignalCard
            data={data}
            onReset={() => navigate('/')}
          />
        )}

        {!loading && !error && !data && (
          <div className="card-base p-8 text-center">
            <p className="text-text-muted text-sm">Loading analysis for <strong className="text-text">{symbol}</strong>...</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AnalysisPage;
