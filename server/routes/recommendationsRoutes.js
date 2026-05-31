import { Router } from 'express';
import { getRecommendations, refreshRecommendations } from '../controllers/recommendationsController.js';

const router = Router();

// Already registered under /api/market, so these become:
// GET  /api/market/recommendations
// POST /api/market/recommendations/refresh

router.get('/recommendations', getRecommendations);
router.post('/recommendations/refresh', refreshRecommendations);

export default router;
