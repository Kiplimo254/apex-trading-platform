import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '../utils/validation.schemas';

const router = Router();
const authController = new AuthController();

router.post(
    '/register',
    validate(registerSchema),
    authController.register.bind(authController)
);

router.post(
    '/login',
    validate(loginSchema),
    authController.login.bind(authController)
);

router.post(
    '/forgot-password',
    validate(forgotPasswordSchema),
    authController.forgotPassword.bind(authController)
);

router.post(
    '/reset-password',
    validate(resetPasswordSchema),
    authController.resetPassword.bind(authController)
);

export default router;
