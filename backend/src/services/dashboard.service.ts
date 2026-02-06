import prisma from '../config/database';
import { InvestmentService } from './investment.service';
import { TransactionService } from './transaction.service';

const investmentService = new InvestmentService();
const transactionService = new TransactionService();

export class DashboardService {
    async getDashboardStats(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                balance: true,
                totalDeposits: true,
                totalWithdrawals: true,
                totalProfit: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return {
            totalBalance: user.balance,
            totalProfit: user.totalProfit,
            totalDeposits: user.totalDeposits,
            totalWithdrawals: user.totalWithdrawals,
        };
    }

    async getRecentTransactions(userId: string) {
        return transactionService.getRecentTransactions(userId, 5);
    }

    async getActiveInvestments(userId: string) {
        return investmentService.getActiveInvestments(userId);
    }
}
