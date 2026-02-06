import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { InvestmentService } from '../services/investment.service';

const investmentService = new InvestmentService();

export class InvestmentController {
    async getPlans(req: AuthRequest, res: Response): Promise<void> {
        try {
            const plans = await investmentService.getInvestmentPlans();
            res.status(200).json({ data: plans });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getInvestments(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const investments = await investmentService.getUserInvestments(userId);
            res.status(200).json({ data: investments });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getInvestmentById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const investmentId = req.params.id;
            const investment = await investmentService.getInvestmentById(
                investmentId,
                userId
            );
            res.status(200).json({ data: investment });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async createInvestment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const investment = await investmentService.createInvestment(
                userId,
                req.body
            );
            res.status(201).json({
                message: 'Investment created successfully',
                data: investment,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
