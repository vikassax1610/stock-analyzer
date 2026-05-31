import { Router } from 'express';
import { getStockSignal, getChartData } from '../controllers/stockController.js';

const router = Router();

// GET /api/stock/chart/:symbol?period=6mo
router.get('/chart/:symbol', getChartData);

// GET /api/stock/:symbol  (must be after /chart/:symbol)
router.get('/:symbol', getStockSignal);

export default router;
