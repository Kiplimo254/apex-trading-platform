import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const referralController = new ReferralController();

// All referral routes require authentication
router.use(authenticate);

router.get('/', referralController.getReferrals.bind(referralController));

router.get('/stats', referralController.getStats.bind(referralController));

export default router;
