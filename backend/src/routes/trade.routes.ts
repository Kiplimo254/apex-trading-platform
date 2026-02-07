import express from 'express';
import tradeService from '../services/trade.service';

const router = express.Router();

// Get user's trades with optional filters
router.get('/', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const filters: any = {};

        if (req.query.type) {
            filters.type = req.query.type as string;
        }

        if (req.query.coinId) {
            filters.coinId = req.query.coinId as string;
        }

        if (req.query.exchange) {
            filters.exchange = req.query.exchange as string;
        }

        if (req.query.startDate) {
            filters.startDate = new Date(req.query.startDate as string);
        }

        if (req.query.endDate) {
            filters.endDate = new Date(req.query.endDate as string);
        }

        const trades = await tradeService.getUserTrades(userId, filters);
        res.json({ success: true, data: trades });
    } catch (error: any) {
        console.error('Trades GET error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get trade statistics
router.get('/stats', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const stats = await tradeService.getTradeStats(userId);
        res.json({ success: true, data: stats });
    } catch (error: any) {
        console.error('Trade stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add trade
router.post('/', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { type, coinId, symbol, name, amount, price, total, fee, exchange, notes, tradeDate } = req.body;

        // Validation
        if (!type || !coinId || !symbol || !name || amount === undefined || price === undefined || total === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: type, coinId, symbol, name, amount, price, total'
            });
        }

        if (type !== 'BUY' && type !== 'SELL') {
            return res.status(400).json({
                success: false,
                message: 'Type must be either BUY or SELL'
            });
        }

        if (amount <= 0 || price <= 0 || total <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount, price, and total must be positive'
            });
        }

        const parsedTradeDate = tradeDate ? new Date(tradeDate) : new Date();

        // Check if trade date is in the future
        if (parsedTradeDate > new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Trade date cannot be in the future'
            });
        }

        const trade = await tradeService.addTrade(userId, {
            type,
            coinId,
            symbol,
            name,
            amount: parseFloat(amount),
            price: parseFloat(price),
            total: parseFloat(total),
            fee: fee ? parseFloat(fee) : 0,
            exchange,
            notes,
            tradeDate: parsedTradeDate,
        });

        res.status(201).json({ success: true, data: trade });
    } catch (error: any) {
        console.error('Add trade error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update trade
router.put('/:id', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { type, amount, price, total, fee, exchange, notes, tradeDate } = req.body;
        const updateData: any = {};

        if (type) {
            if (type !== 'BUY' && type !== 'SELL') {
                return res.status(400).json({
                    success: false,
                    message: 'Type must be either BUY or SELL'
                });
            }
            updateData.type = type;
        }

        if (amount !== undefined) {
            if (amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be positive'
                });
            }
            updateData.amount = parseFloat(amount);
        }

        if (price !== undefined) {
            if (price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price must be positive'
                });
            }
            updateData.price = parseFloat(price);
        }

        if (total !== undefined) {
            if (total <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Total must be positive'
                });
            }
            updateData.total = parseFloat(total);
        }

        if (fee !== undefined) {
            updateData.fee = parseFloat(fee);
        }

        if (exchange !== undefined) {
            updateData.exchange = exchange;
        }

        if (notes !== undefined) {
            updateData.notes = notes;
        }

        if (tradeDate) {
            const parsedTradeDate = new Date(tradeDate);
            if (parsedTradeDate > new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Trade date cannot be in the future'
                });
            }
            updateData.tradeDate = parsedTradeDate;
        }

        const trade = await tradeService.updateTrade(id, userId, updateData);
        res.json({ success: true, data: trade });
    } catch (error: any) {
        console.error('Update trade error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete trade
router.delete('/:id', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        await tradeService.deleteTrade(id, userId);
        res.json({ success: true, message: 'Trade deleted successfully' });
    } catch (error: any) {
        console.error('Delete trade error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;
