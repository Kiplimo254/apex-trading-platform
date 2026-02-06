import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
    async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const profile = await userService.getProfile(userId);
            res.status(200).json({ data: profile });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const profile = await userService.updateProfile(userId, req.body);
            res.status(200).json({
                message: 'Profile updated successfully',
                data: profile,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const stats = await userService.getStats(userId);
            res.status(200).json({ data: stats });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
