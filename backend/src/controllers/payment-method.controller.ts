import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PaymentMethodService } from '../services/payment-method.service';

const paymentMethodService = new PaymentMethodService();

export class PaymentMethodController {
    // Get all payment methods (public - for users)
    async getAllPaymentMethods(req: AuthRequest, res: Response): Promise<void> {
        try {
            const activeOnly = req.query.activeOnly === 'true';
            const methods = await paymentMethodService.getAllPaymentMethods(activeOnly);
            res.status(200).json({ data: methods });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Get payment method by ID
    async getPaymentMethodById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const method = await paymentMethodService.getPaymentMethodById(req.params.id as string);
            res.status(200).json({ data: method });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    // Update payment method (admin only)
    async updatePaymentMethod(req: AuthRequest, res: Response): Promise<void> {
        try {
            const method = await paymentMethodService.updatePaymentMethod(
                req.params.id as string,
                req.body
            );
            res.status(200).json({
                message: 'Payment method updated successfully',
                data: method,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Toggle payment method status (admin only)
    async togglePaymentMethod(req: AuthRequest, res: Response): Promise<void> {
        try {
            const method = await paymentMethodService.togglePaymentMethod(req.params.id as string);
            res.status(200).json({
                message: 'Payment method status updated',
                data: method,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Update PayPal email (admin only)
    async updatePayPalEmail(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const method = await paymentMethodService.updatePayPalEmail(email);
            res.status(200).json({
                message: 'PayPal email updated successfully',
                data: method,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Update mobile money instructions (admin only)
    async updateMobileMoneyInstructions(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { name, instructions } = req.body;
            const method = await paymentMethodService.updateMobileMoneyInstructions(
                name,
                instructions
            );
            res.status(200).json({
                message: 'Instructions updated successfully',
                data: method,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
