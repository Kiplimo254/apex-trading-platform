import prisma from '../config/database';

export class ReferralService {
    async getUserReferrals(userId: string) {
        const referrals = await prisma.referral.findMany({
            where: { referrerId: userId },
            include: {
                referredUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return referrals;
    }

    async getReferralStats(userId: string) {
        const totalReferrals = await prisma.referral.count({
            where: { referrerId: userId },
        });

        const activeReferrals = await prisma.referral.count({
            where: {
                referrerId: userId,
                status: 'ACTIVE',
            },
        });

        const totalCommission = await prisma.referral.aggregate({
            where: { referrerId: userId },
            _sum: {
                commission: true,
            },
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { referralCode: true },
        });

        return {
            totalReferrals,
            activeReferrals,
            totalCommission: totalCommission._sum.commission || 0,
            referralCode: user?.referralCode,
        };
    }
}
