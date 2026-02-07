import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    countryCode: z.string().optional(),
    referralCode: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

// User Schemas
export const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
});

// Investment Schemas
export const createInvestmentSchema = z.object({
    planId: z.string().uuid('Invalid plan ID'),
    amount: z.number().positive('Amount must be positive'),
});

// Transaction Schemas
export const createDepositSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    method: z.string().min(1, 'Payment method is required'),
    walletAddress: z.string().optional(),
    transactionHash: z.string().optional(),
});

export const createWithdrawalSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    method: z.string().min(1, 'Withdrawal method is required'),
    walletAddress: z.string().optional(),
});

export const updateTransactionStatusSchema = z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']),
    notes: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;
export type CreateDepositInput = z.infer<typeof createDepositSchema>;
export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;
export type UpdateTransactionStatusInput = z.infer<typeof updateTransactionStatusSchema>;
