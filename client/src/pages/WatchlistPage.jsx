import Container from '../components/ui/Container';
import WatchlistPanel from '../components/WatchlistPanel';
import useWatchlist from '../hooks/useWatchlist';

const WatchlistPage = () => {
  const { watchlist, loading, remove } = useWatchlist();

  return (
    <div className="flex-1 py-6">
      <Container maxWidth="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">My Watchlist</h1>
          <p className="text-text-muted text-sm mt-1">Track your favorite stocks and quickly access their signals.</p>
        </div>
        <WatchlistPanel
          watchlist={watchlist}
          loading={loading}
          onRemove={remove}
        />
      </Container>
    </div>
  );
};

export default WatchlistPage;
