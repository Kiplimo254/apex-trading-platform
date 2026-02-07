import prisma from '../config/database';

interface AddTradeData {
    type: string; // BUY or SELL
    coinId: string;
    symbol: string;
    name: string;
    amount: number;
    price: number;
    total: number;
    fee?: number;
    exchange?: string;
    notes?: string;
    tradeDate: Date;
}

interface UpdateTradeData {
    type?: string;
    amount?: number;
    price?: number;
    total?: number;
    fee?: number;
    exchange?: string;
    notes?: string;
    tradeDate?: Date;
}

interface TradeFilters {
    type?: string;
    coinId?: string;
    exchange?: string;
    startDate?: Date;
    endDate?: Date;
}

class TradeService {
    // Get user's trades with filters
    async getUserTrades(userId: string, filters?: TradeFilters) {
        const where: any = { userId };

        if (filters?.type) {
            where.type = filters.type;
        }

        if (filters?.coinId) {
            where.coinId = filters.coinId;
        }

        if (filters?.exchange) {
            where.exchange = filters.exchange;
        }

        if (filters?.startDate || filters?.endDate) {
            where.tradeDate = {};
            if (filters.startDate) {
                where.tradeDate.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.tradeDate.lte = filters.endDate;
            }
        }

        return await prisma.trade.findMany({
            where,
            orderBy: { tradeDate: 'desc' },
        });
    }

    // Add new trade
    async addTrade(userId: string, data: AddTradeData) {
        return await prisma.trade.create({
            data: {
                userId,
                ...data,
                fee: data.fee || 0,
            },
        });
    }

    // Update trade
    async updateTrade(tradeId: string, userId: string, data: UpdateTradeData) {
        // Verify ownership
        const trade = await prisma.trade.findFirst({
            where: { id: tradeId, userId },
        });

        if (!trade) {
            throw new Error('Trade not found');
        }

        return await prisma.trade.update({
            where: { id: tradeId },
            data,
        });
    }

    // Delete trade
    async deleteTrade(tradeId: string, userId: string) {
        // Verify ownership
        const trade = await prisma.trade.findFirst({
            where: { id: tradeId, userId },
        });

        if (!trade) {
            throw new Error('Trade not found');
        }

        await prisma.trade.delete({
            where: { id: tradeId },
        });

        return { success: true };
    }

    // Get trade statistics
    async getTradeStats(userId: string) {
        const trades = await prisma.trade.findMany({
            where: { userId },
        });

        const buyTrades = trades.filter(t => t.type === 'BUY');
        const sellTrades = trades.filter(t => t.type === 'SELL');

        const totalBought = buyTrades.reduce((sum, t) => sum + t.total, 0);
        const totalSold = sellTrades.reduce((sum, t) => sum + t.total, 0);
        const totalFees = trades.reduce((sum, t) => sum + t.fee, 0);

        const netProfit = totalSold - totalBought - totalFees;
        const winRate = sellTrades.length > 0
            ? (sellTrades.filter(t => {
                // Find corresponding buy for this sell
                const avgBuyPrice = totalBought / buyTrades.reduce((sum, b) => sum + b.amount, 0);
                return t.price > avgBuyPrice;
            }).length / sellTrades.length) * 100
            : 0;

        // Find best and worst trades
        const profitableTrades = sellTrades.map(sell => {
            const avgBuyPrice = totalBought / buyTrades.reduce((sum, b) => sum + b.amount, 0);
            const profit = (sell.price - avgBuyPrice) * sell.amount - sell.fee;
            return { ...sell, profit };
        });

        const bestTrade = profitableTrades.length > 0
            ? profitableTrades.reduce((best, current) =>
                current.profit > best.profit ? current : best
            )
            : null;

        const worstTrade = profitableTrades.length > 0
            ? profitableTrades.reduce((worst, current) =>
                current.profit < worst.profit ? current : worst
            )
            : null;

        return {
            totalTrades: trades.length,
            buyTrades: buyTrades.length,
            sellTrades: sellTrades.length,
            totalBought,
            totalSold,
            totalFees,
            netProfit,
            winRate,
            bestTrade: bestTrade ? {
                id: bestTrade.id,
                symbol: bestTrade.symbol,
                profit: bestTrade.profit,
                date: bestTrade.tradeDate,
            } : null,
            worstTrade: worstTrade ? {
                id: worstTrade.id,
                symbol: worstTrade.symbol,
                profit: worstTrade.profit,
                date: worstTrade.tradeDate,
            } : null,
        };
    }

    // Get trades by date range for charts
    async getTradesByDateRange(userId: string, startDate: Date, endDate: Date) {
        return await prisma.trade.findMany({
            where: {
                userId,
                tradeDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { tradeDate: 'asc' },
        });
    }
}

export default new TradeService();
