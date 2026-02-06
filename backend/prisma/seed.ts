import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create Investment Plans
    console.log('Creating investment plans...');
    const starterPlan = await prisma.investmentPlan.upsert({
        where: { id: 'starter-plan' },
        update: {},
        create: {
            id: 'starter-plan',
            name: 'Starter',
            description: 'Perfect for beginners. Low risk, steady returns.',
            minAmount: 100,
            maxAmount: 999,
            dailyReturnRate: 2.0,
            durationDays: 30,
            isActive: true,
        },
    });

    const professionalPlan = await prisma.investmentPlan.upsert({
        where: { id: 'professional-plan' },
        update: {},
        create: {
            id: 'professional-plan',
            name: 'Professional',
            description: 'For experienced investors. Balanced risk and reward.',
            minAmount: 1000,
            maxAmount: 9999,
            dailyReturnRate: 3.5,
            durationDays: 45,
            isActive: true,
        },
    });

    const expertPlan = await prisma.investmentPlan.upsert({
        where: { id: 'expert-plan' },
        update: {},
        create: {
            id: 'expert-plan',
            name: 'Expert',
            description: 'Maximum returns for serious investors. Higher risk, higher reward.',
            minAmount: 10000,
            maxAmount: 100000,
            dailyReturnRate: 5.0,
            durationDays: 60,
            isActive: true,
        },
    });

    console.log('✅ Investment plans created');

    // Create Admin User
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@apex.com' },
        update: {},
        create: {
            email: 'admin@apex.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            phone: '+1234567890',
            role: 'ADMIN',
            isVerified: true,
            balance: 0,
        },
    });

    console.log('✅ Admin user created');

    // Create Test User
    console.log('Creating test user...');
    const testUserPassword = await bcrypt.hash('Test@123', 10);
    const testUser = await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            email: 'john@example.com',
            password: testUserPassword,
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1987654321',
            role: 'USER',
            isVerified: true,
            balance: 12450,
            totalDeposits: 15000,
            totalWithdrawals: 4890,
            totalProfit: 2340,
        },
    });

    console.log('✅ Test user created');

    // Create Sample Investments for Test User
    console.log('Creating sample investments...');
    const investment1 = await prisma.investment.create({
        data: {
            userId: testUser.id,
            planId: professionalPlan.id,
            amount: 5000,
            dailyReturn: 175, // 3.5% of 5000
            totalEarned: 875,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-15'),
            status: 'ACTIVE',
        },
    });

    const investment2 = await prisma.investment.create({
        data: {
            userId: testUser.id,
            planId: starterPlan.id,
            amount: 500,
            dailyReturn: 10, // 2% of 500
            totalEarned: 60,
            startDate: new Date('2024-01-05'),
            endDate: new Date('2024-02-04'),
            status: 'ACTIVE',
        },
    });

    console.log('✅ Sample investments created');

    // Create Sample Transactions for Test User
    console.log('Creating sample transactions...');
    await prisma.transaction.createMany({
        data: [
            {
                userId: testUser.id,
                type: 'DEPOSIT',
                amount: 500,
                method: 'Bitcoin',
                status: 'COMPLETED',
                walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                createdAt: new Date('2024-01-15T14:30:00'),
            },
            {
                userId: testUser.id,
                type: 'WITHDRAWAL',
                amount: 200,
                method: 'Bank Transfer',
                status: 'PENDING',
                createdAt: new Date('2024-01-15T10:15:00'),
            },
            {
                userId: testUser.id,
                type: 'PROFIT',
                amount: 45,
                method: 'Daily Return',
                status: 'COMPLETED',
                createdAt: new Date('2024-01-14T23:59:00'),
            },
            {
                userId: testUser.id,
                type: 'DEPOSIT',
                amount: 1000,
                method: 'USDT',
                status: 'COMPLETED',
                walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                createdAt: new Date('2024-01-14T09:00:00'),
            },
            {
                userId: testUser.id,
                type: 'WITHDRAWAL',
                amount: 150,
                method: 'Bank Transfer',
                status: 'FAILED',
                notes: 'Insufficient balance',
                createdAt: new Date('2024-01-13T16:45:00'),
            },
        ],
    });

    console.log('✅ Sample transactions created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin - Email: admin@apex.com, Password: Admin@123');
    console.log('User - Email: john@example.com, Password: Test@123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
