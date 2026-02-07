import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMentorshipClasses() {
    console.log('Seeding mentorship classes...');

    const now = new Date();

    // Helper function to add days to current date
    const addDays = (days: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() + days);
        return date;
    };

    const classes = [
        {
            title: 'Introduction to Cryptocurrency Trading',
            description: 'Learn the fundamentals of cryptocurrency trading. Perfect for beginners who want to understand how crypto markets work, how to read basic charts, and how to make your first trade safely.',
            category: 'Beginner',
            instructor: 'Sarah Johnson',
            scheduledDate: addDays(3),
            duration: 60,
            timezone: 'EAT',
            meetingLink: 'https://zoom.us/j/1234567890',
            meetingPassword: 'crypto101',
            platform: 'Zoom',
            fee: 0,
            maxParticipants: 50,
            status: 'SCHEDULED',
            isActive: true,
        },
        {
            title: 'Technical Indicators Masterclass',
            description: 'Deep dive into technical indicators like RSI, MACD, Moving Averages, and Bollinger Bands. Learn how to use them to make informed trading decisions.',
            category: 'Beginner',
            instructor: 'Michael Chen',
            scheduledDate: addDays(5),
            duration: 90,
            timezone: 'EAT',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            platform: 'Google Meet',
            fee: 30,
            maxParticipants: 30,
            status: 'SCHEDULED',
            isActive: true,
        },
        {
            title: 'Risk Management Workshop',
            description: 'Master the art of risk management in trading. Learn position sizing, stop-loss strategies, portfolio diversification, and how to protect your capital.',
            category: 'Intermediate',
            instructor: 'David Martinez',
            scheduledDate: addDays(7),
            duration: 120,
            timezone: 'EAT',
            meetingLink: 'https://zoom.us/j/9876543210',
            meetingPassword: 'risk2024',
            platform: 'Zoom',
            fee: 50,
            maxParticipants: 25,
            status: 'SCHEDULED',
            isActive: true,
        },
        {
            title: 'Advanced Chart Patterns',
            description: 'Identify and trade advanced chart patterns like Head & Shoulders, Double Tops/Bottoms, Triangles, and Flags. Includes live chart analysis.',
            category: 'Advanced',
            instructor: 'Emily Thompson',
            scheduledDate: addDays(10),
            duration: 90,
            timezone: 'EAT',
            meetingLink: 'https://zoom.us/j/1122334455',
            meetingPassword: 'charts2024',
            platform: 'Zoom',
            fee: 100,
            maxParticipants: 20,
            status: 'SCHEDULED',
            isActive: true,
        },
        {
            title: 'Live Trading Session',
            description: 'Watch a professional trader execute live trades in real-time. Learn market analysis, entry/exit strategies, and risk management in action. Q&A included.',
            category: 'Advanced',
            instructor: 'James Wilson',
            scheduledDate: addDays(14),
            duration: 180,
            timezone: 'EAT',
            meetingLink: 'https://zoom.us/j/5566778899',
            meetingPassword: 'live2024',
            platform: 'Zoom',
            fee: 150,
            maxParticipants: 15,
            status: 'SCHEDULED',
            isActive: true,
        },
        {
            title: 'Building Your Trading Strategy',
            description: 'Create a personalized trading strategy that fits your goals, risk tolerance, and lifestyle. Includes strategy templates and backtesting basics.',
            category: 'Intermediate',
            instructor: 'Lisa Anderson',
            scheduledDate: addDays(21),
            duration: 120,
            timezone: 'EAT',
            meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
            platform: 'Google Meet',
            fee: 75,
            maxParticipants: 25,
            status: 'SCHEDULED',
            isActive: true,
        },
    ];

    for (const classData of classes) {
        await prisma.mentorshipClass.upsert({
            where: { id: classData.title }, // Using title as unique identifier for upsert
            update: classData,
            create: classData,
        });
        console.log(`✓ Created/Updated class: ${classData.title}`);
    }

    console.log('✓ Mentorship classes seeded successfully!');
}

async function main() {
    try {
        await seedMentorshipClasses();
    } catch (error) {
        console.error('Error seeding mentorship classes:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
