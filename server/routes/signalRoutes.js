import { Router } from 'express';
import { getRecentSignals, getSignalHistory } from '../controllers/signalController.js';

const router = Router();

router.get('/recent', getRecentSignals);
router.get('/history/:symbol', getSignalHistory);

export default router;
