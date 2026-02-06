import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// User Management
router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));
router.put('/users/:id', adminController.updateUser.bind(adminController));
router.delete('/users/:id', adminController.deactivateUser.bind(adminController));

// Transaction Management
router.get('/transactions', adminController.getAllTransactions.bind(adminController));
router.put('/transactions/:id/status', adminController.updateTransactionStatus.bind(adminController));

// Investment Management
router.get('/investments', adminController.getAllInvestments.bind(adminController));

// Platform Statistics
router.get('/stats', adminController.getPlatformStats.bind(adminController));

// Referral Management
router.get('/referrals', adminController.getAllReferrals.bind(adminController));

export default router;
