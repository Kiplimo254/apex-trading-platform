import prisma from '../config/database';

export class BotService {
    // Get all bot strategies (public info)
    async getStrategies() {
        return [
            {
                id: 'GRID',
                name: 'Grid Trading Bot',
                description: 'Automatically buys low and sells high within a price range',
                howItWorks: 'Sets up buy orders at lower prices and sell orders at higher prices. Profits from price fluctuations.',
                bestFor: 'Sideways/ranging markets',
                riskLevel: 'MEDIUM',
                expectedReturn: '5-15% monthly',
            },
            {
                id: 'DCA',
                name: 'DCA Bot (Dollar Cost Averaging)',
                description: 'Invests fixed amounts at regular intervals',
                howItWorks: 'Buys crypto at set intervals (daily/weekly). Averages out purchase price and reduces timing risk.',
                bestFor: 'Long-term investors',
                riskLevel: 'LOW',
                expectedReturn: '3-8% monthly',
            },
            {
                id: 'MOMENTUM',
                name: 'Momentum Bot',
                description: 'Follows price trends and momentum',
                howItWorks: 'Detects upward price trends, buys when momentum is strong, sells when trend reverses.',
                bestFor: 'Trending markets',
                riskLevel: 'HIGH',
                expectedReturn: '10-25% monthly',
            },
            {
                id: 'MEAN_REVERSION',
                name: 'Mean Reversion Bot',
                description: 'Trades on price deviations from average',
                howItWorks: 'Calculates average price, buys when price drops below average, sells when price rises above average.',
                bestFor: 'Volatile markets',
                riskLevel: 'MEDIUM',
                expectedReturn: '7-18% monthly',
            },
        ];
    }

    // Get user's bots
    async getUserBots(userId: string) {
        const bots = await prisma.tradingBot.findMany({
            where: { userId },
            include: {
                trades: {
                    orderBy: { executedAt: 'desc' },
                    take: 10,
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return bots;
    }

    // Get bot by ID
    async getBotById(botId: string, userId: string) {
        const bot = await prisma.tradingBot.findFirst({
            where: {
                id: botId,
                userId,
            },
            include: {
                trades: {
                    orderBy: { executedAt: 'desc' },
                },
            },
        });

        if (!bot) {
            throw new Error('Bot not found');
        }

        return bot;
    }

    // Submit bot request
    async submitBotRequest(userId: string, strategy: string, message?: string) {
        const request = await prisma.botRequest.create({
            data: {
                userId,
                strategy,
                message,
            },
        });

        return request;
    }

    // Get bot performance metrics
    async getBotPerformance(botId: string, userId: string) {
        const bot = await this.getBotById(botId, userId);

        const trades = await prisma.botTrade.findMany({
            where: { botId },
            orderBy: { executedAt: 'asc' },
        });

        // Calculate metrics
        const totalTrades = trades.length;
        const profitableTrades = trades.filter(t => (t.profitLoss || 0) > 0).length;
        const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

        const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
        const roi = bot.investmentAmount > 0 ? (totalProfit / bot.investmentAmount) * 100 : 0;

        // Group trades by day for chart
        const dailyProfits: Record<string, number> = {};
        trades.forEach(trade => {
            const date = trade.executedAt.toISOString().split('T')[0];
            dailyProfits[date] = (dailyProfits[date] || 0) + (trade.profitLoss || 0);
        });

        return {
            bot,
            metrics: {
                totalTrades,
                profitableTrades,
                winRate: Math.round(winRate * 100) / 100,
                totalProfit: Math.round(totalProfit * 100) / 100,
                roi: Math.round(roi * 100) / 100,
            },
            dailyProfits,
            recentTrades: trades.slice(-20),
        };
    }

    // Admin: Get all bot requests
    async getAllBotRequests(status?: string) {
        const where = status ? { status } : {};

        const requests = await prisma.botRequest.findMany({
            where,
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
        });

        return requests;
    }

    // Admin: Create bot for user
    async createBot(data: {
        userId: string;
        name: string;
        strategy: string;
        tradingPair: string;
        investmentAmount: number;
        strategyConfig: any;
    }) {
        const bot = await prisma.tradingBot.create({
            data: {
                ...data,
                strategyConfig: JSON.stringify(data.strategyConfig),
                status: 'PENDING',
            },
        });

        return bot;
    }

    // Admin: Update bot
    async updateBot(botId: string, data: {
        name?: string;
        strategy?: string;
        tradingPair?: string;
        investmentAmount?: number;
        strategyConfig?: any;
        status?: string;
    }) {
        const updateData: any = { ...data };
        if (data.strategyConfig) {
            updateData.strategyConfig = JSON.stringify(data.strategyConfig);
        }

        const bot = await prisma.tradingBot.update({
            where: { id: botId },
            data: updateData,
        });

        return bot;
    }

    // Admin: Activate bot
    async activateBot(botId: string) {
        const bot = await prisma.tradingBot.update({
            where: { id: botId },
            data: {
                status: 'ACTIVE',
                activatedAt: new Date(),
            },
        });

        return bot;
    }

    // Admin: Pause bot
    async pauseBot(botId: string) {
        const bot = await prisma.tradingBot.update({
            where: { id: botId },
            data: { status: 'PAUSED' },
        });

        return bot;
    }

    // Admin: Stop bot
    async stopBot(botId: string) {
        const bot = await prisma.tradingBot.update({
            where: { id: botId },
            data: { status: 'STOPPED' },
        });

        return bot;
    }

    // Admin: Delete bot
    async deleteBot(botId: string) {
        await prisma.tradingBot.delete({
            where: { id: botId },
        });
    }

    // Admin: Approve bot request
    async approveBotRequest(requestId: string, adminNotes?: string) {
        const request = await prisma.botRequest.update({
            where: { id: requestId },
            data: {
                status: 'APPROVED',
                adminNotes,
                respondedAt: new Date(),
            },
        });

        return request;
    }

    // Admin: Reject bot request
    async rejectBotRequest(requestId: string, adminNotes?: string) {
        const request = await prisma.botRequest.update({
            where: { id: requestId },
            data: {
                status: 'REJECTED',
                adminNotes,
                respondedAt: new Date(),
            },
        });

        return request;
    }

    // Admin: Get all bots (all users)
    async getAllBots(filters?: { status?: string; userId?: string }) {
        const where: any = {};
        if (filters?.status) where.status = filters.status;
        if (filters?.userId) where.userId = filters.userId;

        const bots = await prisma.tradingBot.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                trades: {
                    orderBy: { executedAt: 'desc' },
                    take: 5,
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return bots;
    }
}
