import prisma from '../config/database';
import {
    CreateDepositInput,
    CreateWithdrawalInput,
    UpdateTransactionStatusInput,
} from '../utils/validation.schemas';

export class TransactionService {
    async createDeposit(userId: string, data: CreateDepositInput) {
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                type: 'DEPOSIT',
                amount: data.amount,
                method: data.method,
                walletAddress: data.walletAddress,
                transactionHash: data.transactionHash,
                status: 'PENDING',
            },
        });

        return transaction;
    }

    async createWithdrawal(userId: string, data: CreateWithdrawalInput) {
        // Check user balance
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.balance < data.amount) {
            throw new Error('Insufficient balance');
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                type: 'WITHDRAWAL',
                amount: data.amount,
                method: data.method,
                walletAddress: data.walletAddress,
                status: 'PENDING',
            },
        });

        return transaction;
    }

    async getTransactions(userId: string, type?: string) {
        const where: any = { userId };

        if (type) {
            where.type = type.toUpperCase();
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return transactions;
    }

    async getTransactionById(transactionId: string, userId: string) {
        const transaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId,
            },
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return transaction;
    }

    async updateTransactionStatus(
        transactionId: string,
        data: UpdateTransactionStatusInput
    ) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { user: true },
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Update transaction status
        const updatedTransaction = await prisma.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: data.status,
                    notes: data.notes,
                },
            });

            // Update user balance if status is COMPLETED
            if (data.status === 'COMPLETED' && transaction.status !== 'COMPLETED') {
                if (transaction.type === 'DEPOSIT') {
                    await tx.user.update({
                        where: { id: transaction.userId },
                        data: {
                            balance: { increment: transaction.amount },
                            totalDeposits: { increment: transaction.amount },
                        },
                    });
                } else if (transaction.type === 'WITHDRAWAL') {
                    await tx.user.update({
                        where: { id: transaction.userId },
                        data: {
                            balance: { decrement: transaction.amount },
                            totalWithdrawals: { increment: transaction.amount },
                        },
                    });
                }
            }

            return updated;
        });

        return updatedTransaction;
    }

    async getRecentTransactions(userId: string, limit: number = 5) {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        return transactions;
    }
}
