import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
    createDepositSchema,
    createWithdrawalSchema,
    updateTransactionStatusSchema,
} from '../utils/validation.schemas';

const router = Router();
const transactionController = new TransactionController();

// All transaction routes require authentication
router.use(authenticate);

router.post(
    '/deposit',
    validate(createDepositSchema),
    transactionController.createDeposit.bind(transactionController)
);

router.post(
    '/withdraw',
    validate(createWithdrawalSchema),
    transactionController.createWithdrawal.bind(transactionController)
);

router.get('/', transactionController.getTransactions.bind(transactionController));

router.get('/:id', transactionController.getTransactionById.bind(transactionController));

// Admin only route
router.put(
    '/:id/status',
    requireAdmin,
    validate(updateTransactionStatusSchema),
    transactionController.updateTransactionStatus.bind(transactionController)
);

export default router;
