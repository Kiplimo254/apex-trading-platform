import prisma from '../config/database';

export class AdminService {
    // User Management
    async getAllUsers(page: number = 1, limit: number = 50, search?: string) {
        const skip = (page - 1) * limit;

        const where = search
            ? {
                OR: [
                    { email: { contains: search } },
                    { firstName: { contains: search } },
                    { lastName: { contains: search } },
                ],
            }
            : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    balance: true,
                    totalDeposits: true,
                    totalWithdrawals: true,
                    totalProfit: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                investments: {
                    include: { plan: true },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                referrals: {
                    include: { referredUser: true },
                },
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateUser(userId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        balance?: number;
        role?: string;
        isActive?: boolean;
        isVerified?: boolean;
    }) {
        const user = await prisma.user.update({
            where: { id: userId },
            data,
        });

        return user;
    }

    async deactivateUser(userId: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
        });

        return user;
    }

    // Transaction Management
    async getAllTransactions(page: number = 1, limit: number = 50, filters?: {
        status?: string;
        type?: string;
    }) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (filters?.status) where.status = filters.status;
        if (filters?.type) where.type = filters.type;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.transaction.count({ where }),
        ]);

        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async updateTransactionStatus(transactionId: string, status: string, notes?: string) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Update transaction and user balance in a transaction
        const updatedTransaction = await prisma.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: { id: transactionId },
                data: { status, notes },
            });

            // Update user balance if status is COMPLETED and it wasn't already completed
            if (status === 'COMPLETED' && transaction.status !== 'COMPLETED') {
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

    // Investment Management
    async getAllInvestments(page: number = 1, limit: number = 50, status?: string) {
        const skip = (page - 1) * limit;

        const where = status ? { status } : {};

        const [investments, total] = await Promise.all([
            prisma.investment.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    plan: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.investment.count({ where }),
        ]);

        return {
            investments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Platform Statistics
    async getPlatformStats() {
        const [
            totalUsers,
            activeUsers,
            totalDeposits,
            totalWithdrawals,
            totalInvestments,
            activeInvestments,
            pendingTransactions,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { isActive: true } }),
            prisma.transaction.aggregate({
                where: { type: 'DEPOSIT', status: 'COMPLETED' },
                _sum: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: { type: 'WITHDRAWAL', status: 'COMPLETED' },
                _sum: { amount: true },
            }),
            prisma.investment.count(),
            prisma.investment.count({ where: { status: 'ACTIVE' } }),
            prisma.transaction.count({ where: { status: 'PENDING' } }),
        ]);

        const platformRevenue = (totalDeposits._sum.amount || 0) - (totalWithdrawals._sum.amount || 0);

        return {
            users: {
                total: totalUsers,
                active: activeUsers,
            },
            transactions: {
                totalDeposits: totalDeposits._sum.amount || 0,
                totalWithdrawals: totalWithdrawals._sum.amount || 0,
                pending: pendingTransactions,
            },
            investments: {
                total: totalInvestments,
                active: activeInvestments,
            },
            platformRevenue,
        };
    }

    // Referral Management
    async getAllReferrals(page: number = 1, limit: number = 50) {
        const skip = (page - 1) * limit;

        const [referrals, total] = await Promise.all([
            prisma.referral.findMany({
                skip,
                take: limit,
                include: {
                    referrer: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    referredUser: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.referral.count(),
        ]);

        return {
            referrals,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
