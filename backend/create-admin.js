const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔍 Checking for existing admin...\n');
        
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });
        
        if (existingAdmin) {
            console.log('✅ Admin already exists:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   ID: ${existingAdmin.id}\n`);
            return;
        }
        
        console.log('📝 Creating new admin user...\n');
        
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        
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
        
        console.log('✅ Admin user created successfully!\n');
        console.log('📧 Email: admin@apex.com');
        console.log('🔑 Password: Admin@123');
        console.log(`👤 ID: ${admin.id}\n`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
