import { Router } from 'express';
import marketService from '../services/market.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All market routes require authentication
router.use(authenticate);

// Get list of markets (top coins)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 100;

        const markets = await marketService.getMarkets(page, perPage);

        res.json({
            success: true,
            data: markets,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch markets',
        });
    }
});

// Get trending coins
router.get('/trending', async (req, res) => {
    try {
        const trending = await marketService.getTrending();

        res.json({
            success: true,
            data: trending,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch trending coins',
        });
    }
});

// Search coins
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required',
            });
        }

        const results = await marketService.searchCoins(query);

        res.json({
            success: true,
            data: results,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to search coins',
        });
    }
});

// Get coin details
router.get('/:coinId', async (req, res) => {
    try {
        const { coinId } = req.params;
        const coin = await marketService.getCoinDetails(coinId);

        res.json({
            success: true,
            data: coin,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch coin details',
        });
    }
});

// Get coin chart data
router.get('/:coinId/chart', async (req, res) => {
    try {
        const { coinId } = req.params;
        const days = parseInt(req.query.days as string) || 7;

        const chart = await marketService.getCoinChart(coinId, days);

        res.json({
            success: true,
            data: chart,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch chart data',
        });
    }
});

export default router;
