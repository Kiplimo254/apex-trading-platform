import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AdminService } from '../services/admin.service';

const adminService = new AdminService();

export class AdminController {
    // User Management
    async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const search = req.query.search as string;

            const result = await adminService.getAllUsers(page, limit, search);
            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUserById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const user = await adminService.getUserById(userId);
            res.status(200).json({ data: user });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const user = await adminService.updateUser(userId, req.body);
            res.status(200).json({
                message: 'User updated successfully',
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deactivateUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const user = await adminService.deactivateUser(userId);
            res.status(200).json({
                message: 'User deactivated successfully',
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Transaction Management
    async getAllTransactions(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const filters = {
                status: req.query.status as string,
                type: req.query.type as string,
            };

            const result = await adminService.getAllTransactions(page, limit, filters);
            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateTransactionStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const transactionId = req.params.id;
            const { status, notes } = req.body;

            const transaction = await adminService.updateTransactionStatus(
                transactionId,
                status,
                notes
            );

            res.status(200).json({
                message: 'Transaction status updated successfully',
                data: transaction,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Investment Management
    async getAllInvestments(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const status = req.query.status as string;

            const result = await adminService.getAllInvestments(page, limit, status);
            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Platform Statistics
    async getPlatformStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const stats = await adminService.getPlatformStats();
            res.status(200).json({ data: stats });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Referral Management
    async getAllReferrals(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;

            const result = await adminService.getAllReferrals(page, limit);
            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
