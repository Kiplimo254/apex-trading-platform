import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ReferralService } from '../services/referral.service';

const referralService = new ReferralService();

export class ReferralController {
    async getReferrals(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const referrals = await referralService.getUserReferrals(userId);
            res.status(200).json({ data: referrals });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const stats = await referralService.getReferralStats(userId);
            res.status(200).json({ data: stats });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
