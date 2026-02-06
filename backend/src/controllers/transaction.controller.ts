import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TransactionService } from '../services/transaction.service';

const transactionService = new TransactionService();

export class TransactionController {
    async createDeposit(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const transaction = await transactionService.createDeposit(userId, req.body);
            res.status(201).json({
                message: 'Deposit request created successfully',
                data: transaction,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async createWithdrawal(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const transaction = await transactionService.createWithdrawal(userId, req.body);
            res.status(201).json({
                message: 'Withdrawal request created successfully',
                data: transaction,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getTransactions(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const type = req.query.type as string | undefined;
            const transactions = await transactionService.getTransactions(userId, type);
            res.status(200).json({ data: transactions });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getTransactionById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const transactionId = req.params.id;
            const transaction = await transactionService.getTransactionById(
                transactionId,
                userId
            );
            res.status(200).json({ data: transaction });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateTransactionStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const transactionId = req.params.id;
            const transaction = await transactionService.updateTransactionStatus(
                transactionId,
                req.body
            );
            res.status(200).json({
                message: 'Transaction status updated successfully',
                data: transaction,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
