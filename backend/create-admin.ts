import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('Checking for existing admin...');

        // Check if admin exists
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists:', existingAdmin.email);
            return;
        }

        console.log('Creating admin user...');

        // Hash password
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: 'admin@apex.com',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN',
                isActive: true,
                isVerified: true,
                balance: 0,
                totalDeposits: 0,
                totalWithdrawals: 0,
                totalProfit: 0,
            }
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@apex.com');
        console.log('🔑 Password: Admin@123');
        console.log('👤 User ID:', admin.id);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
