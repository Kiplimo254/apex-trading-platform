import express from 'express';
import portfolioService from '../services/portfolio.service';

const router = express.Router();

// Get user's portfolio
router.get('/', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const portfolio = await portfolioService.getUserPortfolio(userId);
        res.json({ success: true, data: portfolio });
    } catch (error: any) {
        console.error('Portfolio GET error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get portfolio summary (total value, P&L)
router.get('/summary', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const summary = await portfolioService.getPortfolioSummary(userId);
        res.json({ success: true, data: summary });
    } catch (error: any) {
        console.error('Portfolio summary error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add holding
router.post('/', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { coinId, symbol, name, amount, averageBuyPrice, notes } = req.body;

        if (!coinId || !symbol || !name || amount === undefined || averageBuyPrice === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: coinId, symbol, name, amount, averageBuyPrice'
            });
        }

        if (amount <= 0 || averageBuyPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount and average buy price must be positive'
            });
        }

        const holding = await portfolioService.addHolding(userId, {
            coinId,
            symbol,
            name,
            amount: parseFloat(amount),
            averageBuyPrice: parseFloat(averageBuyPrice),
            notes,
        });

        res.status(201).json({ success: true, data: holding });
    } catch (error: any) {
        console.error('Add holding error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update holding
router.put('/:id', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { amount, averageBuyPrice, notes } = req.body;
        const updateData: any = {};

        if (amount !== undefined) {
            if (amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be positive'
                });
            }
            updateData.amount = parseFloat(amount);
        }

        if (averageBuyPrice !== undefined) {
            if (averageBuyPrice <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Average buy price must be positive'
                });
            }
            updateData.averageBuyPrice = parseFloat(averageBuyPrice);
        }

        if (notes !== undefined) {
            updateData.notes = notes;
        }

        const holding = await portfolioService.updateHolding(id, userId, updateData);
        res.json({ success: true, data: holding });
    } catch (error: any) {
        console.error('Update holding error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete holding
router.delete('/:id', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        await portfolioService.deleteHolding(id, userId);
        res.json({ success: true, message: 'Holding deleted successfully' });
    } catch (error: any) {
        console.error('Delete holding error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;
