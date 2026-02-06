import prisma from '../config/database';
import { UpdateProfileInput } from '../utils/validation.schemas';

export class UserService {
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                referralCode: true,
                balance: true,
                totalDeposits: true,
                totalWithdrawals: true,
                totalProfit: true,
                isVerified: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateProfile(userId: string, data: UpdateProfileInput) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                referralCode: true,
            },
        });

        return user;
    }

    async getStats(userId: string) {
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

        const activeInvestments = await prisma.investment.count({
            where: {
                userId,
                status: 'ACTIVE',
            },
        });

        const totalInvested = await prisma.investment.aggregate({
            where: {
                userId,
                status: { in: ['ACTIVE', 'COMPLETED'] },
            },
            _sum: {
                amount: true,
            },
        });

        return {
            balance: user.balance,
            totalDeposits: user.totalDeposits,
            totalWithdrawals: user.totalWithdrawals,
            totalProfit: user.totalProfit,
            activeInvestments,
            totalInvested: totalInvested._sum.amount || 0,
        };
    }
}
