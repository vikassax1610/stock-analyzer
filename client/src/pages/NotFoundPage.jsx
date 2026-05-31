import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

const NotFoundPage = () => (
  <div className="flex-1 flex items-center justify-center py-20">
    <Container maxWidth="max-w-lg">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold font-num text-border">404</div>
        <div>
          <h1 className="text-xl font-bold text-text">Page Not Found</h1>
          <p className="text-text-muted text-sm mt-2">The page you're looking for doesn't exist.</p>
        </div>
        <Link to="/">
          <Button variant="primary">← Back to Dashboard</Button>
        </Link>
      </div>
    </Container>
  </div>
);

export default NotFoundPage;
