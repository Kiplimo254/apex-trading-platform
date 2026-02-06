import prisma from '../config/database';
import { CreateInvestmentInput } from '../utils/validation.schemas';

export class InvestmentService {
    async getInvestmentPlans() {
        const plans = await prisma.investmentPlan.findMany({
            where: { isActive: true },
            orderBy: { minAmount: 'asc' },
        });

        return plans;
    }

    async getUserInvestments(userId: string) {
        const investments = await prisma.investment.findMany({
            where: { userId },
            include: {
                plan: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return investments;
    }

    async getInvestmentById(investmentId: string, userId: string) {
        const investment = await prisma.investment.findFirst({
            where: {
                id: investmentId,
                userId,
            },
            include: {
                plan: true,
            },
        });

        if (!investment) {
            throw new Error('Investment not found');
        }

        return investment;
    }

    async createInvestment(userId: string, data: CreateInvestmentInput) {
        // Get investment plan
        const plan = await prisma.investmentPlan.findUnique({
            where: { id: data.planId },
        });

        if (!plan || !plan.isActive) {
            throw new Error('Invalid investment plan');
        }

        // Validate amount
        if (data.amount < plan.minAmount || data.amount > plan.maxAmount) {
            throw new Error(
                `Investment amount must be between $${plan.minAmount} and $${plan.maxAmount}`
            );
        }

        // Get user balance
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

        // Calculate investment details
        const dailyReturn = (data.amount * plan.dailyReturnRate) / 100;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);

        // Create investment and update user balance in a transaction
        const investment = await prisma.$transaction(async (tx) => {
            // Deduct from user balance
            await tx.user.update({
                where: { id: userId },
                data: {
                    balance: {
                        decrement: data.amount,
                    },
                },
            });

            // Create investment
            const newInvestment = await tx.investment.create({
                data: {
                    userId,
                    planId: data.planId,
                    amount: data.amount,
                    dailyReturn,
                    endDate,
                    status: 'ACTIVE',
                },
                include: {
                    plan: true,
                },
            });

            return newInvestment;
        });

        return investment;
    }

    async getActiveInvestments(userId: string) {
        const investments = await prisma.investment.findMany({
            where: {
                userId,
                status: 'ACTIVE',
            },
            include: {
                plan: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return investments.map((inv) => {
            const now = new Date();
            const daysElapsed = Math.floor(
                (now.getTime() - inv.startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const totalDays = Math.floor(
                (inv.endDate.getTime() - inv.startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const daysLeft = totalDays - daysElapsed;
            const progress = Math.min((daysElapsed / totalDays) * 100, 100);

            return {
                ...inv,
                daysLeft: Math.max(daysLeft, 0),
                progress: Math.round(progress),
            };
        });
    }
}
