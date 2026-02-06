import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { updateProfileSchema } from '../utils/validation.schemas';

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile.bind(userController));

router.put(
    '/profile',
    validate(updateProfileSchema),
    userController.updateProfile.bind(userController)
);

router.get('/stats', userController.getStats.bind(userController));

export default router;
