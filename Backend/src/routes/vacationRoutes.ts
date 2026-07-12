import { Router } from 'express';
import {
  getVacations,
  getVacationById,
  createVacation,
  updateVacation,
  deleteVacation,
  toggleLike,
  getReport,
  downloadCsv,
} from '../controllers/vacationController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', authenticate, getVacations);
router.get('/report', authenticate, requireAdmin, getReport);
router.get('/report/csv', authenticate, requireAdmin, downloadCsv);
router.get('/:id', authenticate, getVacationById);
router.post('/', authenticate, requireAdmin, upload.single('image'), createVacation);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateVacation);
router.delete('/:id', authenticate, requireAdmin, deleteVacation);
router.post('/:id/like', authenticate, toggleLike);

export default router;
