import { Router } from 'express';
import { queryDatabase } from '../controllers/mcpController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { mcpQuerySchema } from '../validators/schemas';

const router = Router();

router.post('/query', authenticate, validate(mcpQuerySchema), queryDatabase);

export default router;
