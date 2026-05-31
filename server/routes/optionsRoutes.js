import { Router } from 'express';
import { getOptionSignal } from '../controllers/optionsController.js';

const router = Router();

// GET /api/options/:symbol  (e.g., /api/options/NIFTY)
router.get('/:symbol', getOptionSignal);

export default router;
