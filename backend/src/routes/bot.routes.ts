import { Router } from 'express';
import { BotService } from '../services/bot.service';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const botService = new BotService();

// Public: Get available strategies
router.get('/strategies', async (req, res) => {
    try {
        const strategies = await botService.getStrategies();
        res.json({
            success: true,
            data: strategies,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch strategies',
        });
    }
});

// User: Get my bots
router.get('/my-bots', authenticate, async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const bots = await botService.getUserBots(userId);

        res.json({
            success: true,
            data: bots,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch bots',
        });
    }
});

// User: Submit bot request
router.post('/request', authenticate, async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { strategy, message } = req.body;

        if (!strategy) {
            return res.status(400).json({
                success: false,
                error: 'Strategy is required',
            });
        }

        const request = await botService.submitBotRequest(userId, strategy, message);

        res.json({
            success: true,
            data: request,
            message: 'Bot request submitted successfully. Admin will contact you soon.',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to submit request',
        });
    }
});

// User: Get bot performance
router.get('/:id/performance', authenticate, async (req, res) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { id } = req.params;

        const performance = await botService.getBotPerformance(id, userId);

        res.json({
            success: true,
            data: performance,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch performance',
        });
    }
});

// Admin: Get all bot requests
router.get('/admin/requests', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const requests = await botService.getAllBotRequests(status as string);

        res.json({
            success: true,
            data: requests,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch requests',
        });
    }
});

// Admin: Get all bots
router.get('/admin/bots', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status, userId } = req.query;
        const bots = await botService.getAllBots({
            status: status as string,
            userId: userId as string,
        });

        res.json({
            success: true,
            data: bots,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch bots',
        });
    }
});

// Admin: Create bot
router.post('/admin/bots', authenticate, requireAdmin, async (req, res) => {
    try {
        const { userId, name, strategy, tradingPair, investmentAmount, strategyConfig } = req.body;

        if (!userId || !name || !strategy || !tradingPair || !investmentAmount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }

        const bot = await botService.createBot({
            userId,
            name,
            strategy,
            tradingPair,
            investmentAmount,
            strategyConfig: strategyConfig || {},
        });

        res.json({
            success: true,
            data: bot,
            message: 'Bot created successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create bot',
        });
    }
});

// Admin: Update bot
router.put('/admin/bots/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const bot = await botService.updateBot(id, req.body);

        res.json({
            success: true,
            data: bot,
            message: 'Bot updated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update bot',
        });
    }
});

// Admin: Activate bot
router.post('/admin/bots/:id/activate', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const bot = await botService.activateBot(id);

        res.json({
            success: true,
            data: bot,
            message: 'Bot activated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to activate bot',
        });
    }
});

// Admin: Pause bot
router.post('/admin/bots/:id/pause', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const bot = await botService.pauseBot(id);

        res.json({
            success: true,
            data: bot,
            message: 'Bot paused successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to pause bot',
        });
    }
});

// Admin: Delete bot
router.delete('/admin/bots/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await botService.deleteBot(id);

        res.json({
            success: true,
            message: 'Bot deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete bot',
        });
    }
});

// Admin: Approve request
router.post('/admin/requests/:id/approve', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes } = req.body;

        const request = await botService.approveBotRequest(id, adminNotes);

        res.json({
            success: true,
            data: request,
            message: 'Request approved successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to approve request',
        });
    }
});

// Admin: Reject request
router.post('/admin/requests/:id/reject', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes } = req.body;

        const request = await botService.rejectBotRequest(id, adminNotes);

        res.json({
            success: true,
            data: request,
            message: 'Request rejected',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to reject request',
        });
    }
});

export default router;
