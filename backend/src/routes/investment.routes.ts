import { Router } from 'express';
import { InvestmentController } from '../controllers/investment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createInvestmentSchema } from '../utils/validation.schemas';

const router = Router();
const investmentController = new InvestmentController();

// All investment routes require authentication
router.use(authenticate);

router.get('/plans', investmentController.getPlans.bind(investmentController));

router.get('/', investmentController.getInvestments.bind(investmentController));

router.get('/:id', investmentController.getInvestmentById.bind(investmentController));

router.post(
    '/',
    validate(createInvestmentSchema),
    investmentController.createInvestment.bind(investmentController)
);

export default router;
