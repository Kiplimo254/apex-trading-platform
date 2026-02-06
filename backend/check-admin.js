const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAndCreateAdmin() {
    try {
        // Check all users
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true, isActive: true }
        });
        
        console.log('\n=== Current Users ===');
        console.log(`Total users: ${users.length}`);
        users.forEach(u => console.log(`- ${u.email} (${u.role}) ${u.isActive ? '✓' : '✗'}`));
        
        // Check for admin
        const admin = users.find(u => u.role === 'ADMIN');
        
        if (!admin) {
            console.log('\n⚠️  No admin user found! Creating one...');
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            
            const newAdmin = await prisma.user.create({
                data: {
                    email: 'admin@apex.com',
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'ADMIN',
                    isActive: true,
                    isVerified: true,
                }
            });
            
            console.log('✅ Admin user created!');
            console.log(`Email: admin@apex.com`);
            console.log(`Password: Admin@123`);
        } else {
            console.log(`\n✅ Admin user exists: ${admin.email}`);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkAndCreateAdmin();
