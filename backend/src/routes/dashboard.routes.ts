import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

// All dashboard routes require authentication
router.use(authenticate);

router.get('/stats', dashboardController.getStats.bind(dashboardController));

router.get(
    '/recent-transactions',
    dashboardController.getRecentTransactions.bind(dashboardController)
);

router.get(
    '/active-investments',
    dashboardController.getActiveInvestments.bind(dashboardController)
);

export default router;
