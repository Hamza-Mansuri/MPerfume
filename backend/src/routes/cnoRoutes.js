import { Router } from 'express';
import {
  createSample,
  getAllSamples,
  getSampleById,
  updateSample,
  deleteSample,
  getNextSerial,
  getProductSuggestions,
} from '../controllers/cnoController.js';

const router = Router();

router.get('/next-serial', getNextSerial);
router.get('/suggestions', getProductSuggestions);
router.get('/', getAllSamples);
router.post('/', createSample);
router.get('/:id', getSampleById);
router.put('/:id', updateSample);
router.delete('/:id', deleteSample);

export default router;
