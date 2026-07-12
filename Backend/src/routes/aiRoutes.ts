import { Router } from 'express';
import { getRecommendation } from '../controllers/aiController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { aiRecommendationSchema } from '../validators/schemas';

const router = Router();

router.post('/recommend', authenticate, validate(aiRecommendationSchema), getRecommendation);

export default router;
