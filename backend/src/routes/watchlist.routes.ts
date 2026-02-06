import { Router } from 'express';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All watchlist routes require authentication
router.use(authenticate);

// Get user's watchlist
router.get('/', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;

        const watchlist = await prisma.watchlist.findMany({
            where: { userId },
            orderBy: { addedAt: 'desc' },
        });

        res.json({
            success: true,
            data: watchlist,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch watchlist',
        });
    }
});

// Add coin to watchlist
router.post('/', async (req, res) => {
    try {
        console.log('Watchlist POST - req.user:', (req as any).user);
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { coinId, symbol, name } = req.body;

        if (!userId) {
            console.log('Watchlist POST - No userId found, user object:', (req as any).user);
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
            });
        }

        if (!coinId || !symbol || !name) {
            return res.status(400).json({
                success: false,
                error: 'coinId, symbol, and name are required',
            });
        }

        // Check if already in watchlist
        const existing = await prisma.watchlist.findFirst({
            where: {
                userId: userId,
                coinId: coinId,
            },
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Coin already in watchlist',
            });
        }

        const watchlistItem = await prisma.watchlist.create({
            data: {
                userId: userId,
                coinId,
                symbol,
                name,
            },
        });


        res.json({
            success: true,
            data: watchlistItem,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to add to watchlist',
        });
    }
});

// Remove coin from watchlist
router.delete('/:coinId', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { coinId } = req.params;

        const item = await prisma.watchlist.findFirst({
            where: {
                userId: userId,
                coinId: coinId,
            },
        });

        if (item) {
            await prisma.watchlist.delete({
                where: { id: item.id },
            });
        }

        res.json({
            success: true,
            message: 'Removed from watchlist',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to remove from watchlist',
        });
    }
});

// Check if coin is in watchlist
router.get('/check/:coinId', async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { coinId } = req.params;

        const item = await prisma.watchlist.findFirst({
            where: {
                userId: userId,
                coinId: coinId,
            },
        });

        res.json({
            success: true,
            data: { inWatchlist: !!item },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to check watchlist',
        });
    }
});

export default router;
