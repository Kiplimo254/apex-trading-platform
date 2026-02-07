import prisma from '../config/database';
import axios from 'axios';

interface AddHoldingData {
    coinId: string;
    symbol: string;
    name: string;
    amount: number;
    averageBuyPrice: number;
    notes?: string;
}

interface UpdateHoldingData {
    amount?: number;
    averageBuyPrice?: number;
    notes?: string;
}

class PortfolioService {
    // Get user's portfolio with current prices
    async getUserPortfolio(userId: string) {
        const holdings = await prisma.portfolio.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        if (holdings.length === 0) {
            return [];
        }

        // Fetch current prices from CoinGecko
        const coinIds = holdings.map(h => h.coinId).join(',');
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`
            );

            // Enrich holdings with current price and P&L
            return holdings.map(holding => {
                const priceData = response.data[holding.coinId];
                const currentPrice = priceData?.usd || 0;
                const change24h = priceData?.usd_24h_change || 0;

                const currentValue = holding.amount * currentPrice;
                const investedValue = holding.amount * holding.averageBuyPrice;
                const profitLoss = currentValue - investedValue;
                const profitLossPercentage = investedValue > 0
                    ? (profitLoss / investedValue) * 100
                    : 0;

                return {
                    ...holding,
                    currentPrice,
                    change24h,
                    currentValue,
                    investedValue,
                    profitLoss,
                    profitLossPercentage,
                };
            });
        } catch (error) {
            console.error('Failed to fetch prices:', error);
            // Return holdings without price data
            return holdings.map(holding => ({
                ...holding,
                currentPrice: 0,
                change24h: 0,
                currentValue: 0,
                investedValue: holding.amount * holding.averageBuyPrice,
                profitLoss: 0,
                profitLossPercentage: 0,
            }));
        }
    }

    // Add new holding
    async addHolding(userId: string, data: AddHoldingData) {
        // Check if holding already exists
        const existing = await prisma.portfolio.findUnique({
            where: {
                userId_coinId: {
                    userId,
                    coinId: data.coinId,
                },
            },
        });

        if (existing) {
            throw new Error('You already have this coin in your portfolio. Please update the existing holding.');
        }

        return await prisma.portfolio.create({
            data: {
                userId,
                ...data,
            },
        });
    }

    // Update holding
    async updateHolding(holdingId: string, userId: string, data: UpdateHoldingData) {
        // Verify ownership
        const holding = await prisma.portfolio.findFirst({
            where: { id: holdingId, userId },
        });

        if (!holding) {
            throw new Error('Holding not found');
        }

        return await prisma.portfolio.update({
            where: { id: holdingId },
            data,
        });
    }

    // Delete holding
    async deleteHolding(holdingId: string, userId: string) {
        // Verify ownership
        const holding = await prisma.portfolio.findFirst({
            where: { id: holdingId, userId },
        });

        if (!holding) {
            throw new Error('Holding not found');
        }

        await prisma.portfolio.delete({
            where: { id: holdingId },
        });

        return { success: true };
    }

    // Get portfolio total value and P&L
    async getPortfolioSummary(userId: string) {
        const holdings = await this.getUserPortfolio(userId);

        const summary = holdings.reduce(
            (acc, holding) => {
                acc.totalValue += holding.currentValue;
                acc.totalInvested += holding.investedValue;
                acc.totalProfitLoss += holding.profitLoss;
                return acc;
            },
            { totalValue: 0, totalInvested: 0, totalProfitLoss: 0 }
        );

        const profitLossPercentage = summary.totalInvested > 0
            ? (summary.totalProfitLoss / summary.totalInvested) * 100
            : 0;

        return {
            ...summary,
            profitLossPercentage,
            holdingsCount: holdings.length,
        };
    }
}

export default new PortfolioService();
