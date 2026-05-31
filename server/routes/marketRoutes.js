import { Router } from 'express';
import { getOverview, getGainers, getLosers, getMovers } from '../controllers/marketController.js';

const router = Router();

// GET /api/market/overview
router.get('/overview', getOverview);

// GET /api/market/gainers
router.get('/gainers', getGainers);

// GET /api/market/losers
router.get('/losers', getLosers);

// GET /api/market/movers  (gainers + losers in one call)
router.get('/movers', getMovers);

export default router;
