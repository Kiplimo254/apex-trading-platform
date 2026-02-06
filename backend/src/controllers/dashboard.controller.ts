import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
    async getStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const stats = await dashboardService.getDashboardStats(userId);
            res.status(200).json({ data: stats });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getRecentTransactions(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const transactions = await dashboardService.getRecentTransactions(userId);
            res.status(200).json({ data: transactions });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getActiveInvestments(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const investments = await dashboardService.getActiveInvestments(userId);
            res.status(200).json({ data: investments });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
