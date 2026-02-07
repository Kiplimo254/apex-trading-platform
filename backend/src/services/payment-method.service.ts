import prisma from '../config/database';

interface UpdatePaymentMethodData {
    instructions?: string;
    paypalEmail?: string;
    isActive?: boolean;
    displayOrder?: number;
}

export class PaymentMethodService {
    // Get all payment methods
    async getAllPaymentMethods(activeOnly: boolean = false) {
        const where = activeOnly ? { isActive: true } : {};

        return await prisma.paymentMethod.findMany({
            where,
            orderBy: { displayOrder: 'asc' },
        });
    }

    // Get payment method by ID
    async getPaymentMethodById(id: string) {
        const method = await prisma.paymentMethod.findUnique({
            where: { id },
        });

        if (!method) {
            throw new Error('Payment method not found');
        }

        return method;
    }

    // Get payment method by name
    async getPaymentMethodByName(name: string) {
        const method = await prisma.paymentMethod.findUnique({
            where: { name },
        });

        if (!method) {
            throw new Error('Payment method not found');
        }

        return method;
    }

    // Update payment method
    async updatePaymentMethod(id: string, data: UpdatePaymentMethodData) {
        const method = await prisma.paymentMethod.findUnique({
            where: { id },
        });

        if (!method) {
            throw new Error('Payment method not found');
        }

        return await prisma.paymentMethod.update({
            where: { id },
            data,
        });
    }

    // Toggle payment method status
    async togglePaymentMethod(id: string) {
        const method = await prisma.paymentMethod.findUnique({
            where: { id },
        });

        if (!method) {
            throw new Error('Payment method not found');
        }

        return await prisma.paymentMethod.update({
            where: { id },
            data: { isActive: !method.isActive },
        });
    }

    // Update PayPal email
    async updatePayPalEmail(email: string) {
        const paypal = await prisma.paymentMethod.findUnique({
            where: { name: 'PayPal' },
        });

        if (!paypal) {
            throw new Error('PayPal payment method not found');
        }

        return await prisma.paymentMethod.update({
            where: { id: paypal.id },
            data: { paypalEmail: email },
        });
    }

    // Update mobile money instructions
    async updateMobileMoneyInstructions(name: string, instructions: string) {
        const method = await prisma.paymentMethod.findUnique({
            where: { name },
        });

        if (!method) {
            throw new Error('Payment method not found');
        }

        if (method.type !== 'MOBILE_MONEY') {
            throw new Error('This method is not a mobile money payment');
        }

        return await prisma.paymentMethod.update({
            where: { id: method.id },
            data: { instructions },
        });
    }
}
