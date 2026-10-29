import {Router} from 'express';
import {recommend} from '../controllers/recommendationController.js';
import {concierge} from '../controllers/conciergeController.js';
const router=Router();
router.post('/',recommend);
router.post('/concierge',concierge);
export default router;
