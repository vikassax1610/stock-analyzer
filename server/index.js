import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { PORT } from './config/env.js';

// Middleware
import requestLogger from './middlewares/requestLogger.js';
import errorHandler from './middlewares/errorHandler.js';

// Routes
import stockRoutes from './routes/stockRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import signalRoutes from './routes/signalRoutes.js';
import optionsRoutes from './routes/optionsRoutes.js';
import recommendationsRoutes from './routes/recommendationsRoutes.js';

// ─── App Setup ────────────────────────────────────────────────────────────────
const app = express();

// CORS — allow Vite dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'https://stock-analyzer-ruby-nine.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/stock', stockRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/market', recommendationsRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/signals', signalRoutes);
app.use('/api/options', optionsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Stock Signal Server running on http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/health\n`);
  });
};

startServer();