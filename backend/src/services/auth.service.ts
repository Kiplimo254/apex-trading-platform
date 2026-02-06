import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt.util';
import {
    RegisterInput,
    LoginInput,
} from '../utils/validation.schemas';

export class AuthService {
    async register(data: RegisterInput) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Handle referral if provided
        let referrerId: string | undefined;
        if (data.referralCode) {
            const referrer = await prisma.user.findUnique({
                where: { referralCode: data.referralCode },
            });
            referrerId = referrer?.id;
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                referredBy: referrerId,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                referralCode: true,
                role: true,
                createdAt: true,
            },
        });

        // Create referral record if referred
        if (referrerId) {
            await prisma.referral.create({
                data: {
                    referrerId,
                    referredUserId: user.id,
                    status: 'ACTIVE',
                },
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return { user, token };
    }

    async login(data: LoginInput) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                referralCode: user.referralCode,
                role: user.role,
                balance: user.balance,
                isVerified: user.isVerified,
            },
            token,
        };
    }

    async forgotPassword(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists
            return { message: 'If the email exists, a reset link has been sent' };
        }

        // TODO: Implement email sending with reset token
        // For now, just return success message
        return { message: 'Password reset email sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        // TODO: Implement token verification and password reset
        // For now, just return success message
        return { message: 'Password reset successful' };
    }
}
