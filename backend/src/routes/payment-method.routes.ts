import { Router } from 'express';
import { PaymentMethodController } from '../controllers/payment-method.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const paymentMethodController = new PaymentMethodController();

// Public routes (authenticated users)
router.get(
    '/',
    authenticate,
    paymentMethodController.getAllPaymentMethods.bind(paymentMethodController)
);

router.get(
    '/:id',
    authenticate,
    paymentMethodController.getPaymentMethodById.bind(paymentMethodController)
);

// Admin routes
router.put(
    '/:id',
    authenticate,
    requireAdmin,
    paymentMethodController.updatePaymentMethod.bind(paymentMethodController)
);

router.patch(
    '/:id/toggle',
    authenticate,
    requireAdmin,
    paymentMethodController.togglePaymentMethod.bind(paymentMethodController)
);

router.put(
    '/paypal/email',
    authenticate,
    requireAdmin,
    paymentMethodController.updatePayPalEmail.bind(paymentMethodController)
);

router.put(
    '/mobile-money/instructions',
    authenticate,
    requireAdmin,
    paymentMethodController.updateMobileMoneyInstructions.bind(paymentMethodController)
);

export default router;
