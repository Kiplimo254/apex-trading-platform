import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                message: 'User registered successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.login(req.body);
            res.status(200).json({
                message: 'Login successful',
                data: result,
            });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.forgotPassword(req.body.email);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.resetPassword(
                req.body.token,
                req.body.newPassword
            );
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
