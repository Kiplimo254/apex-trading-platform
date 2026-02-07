import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPaymentMethods() {
    console.log('Seeding payment methods...');

    const paymentMethods = [
        {
            name: 'MyZaka',
            type: 'MOBILE_MONEY',
            instructions: `**MyZaka Payment Instructions:**

1. Open your MyZaka app or dial *123#
2. Select "Send Money"
3. Enter the merchant number: **XXXXX**
4. Enter the amount you want to deposit
5. Confirm the transaction
6. Take a screenshot of the confirmation message
7. Upload the screenshot when submitting your deposit request

**Important Notes:**
- Minimum deposit: P50
- Processing time: 5-30 minutes
- Keep your transaction reference number`,
            isActive: true,
            displayOrder: 1,
        },
        {
            name: 'Orange Money',
            type: 'MOBILE_MONEY',
            instructions: `**Orange Money Payment Instructions:**

1. Dial #144# from your Orange line
2. Select "Send Money"
3. Enter merchant code: **XXXXX**
4. Enter the amount to deposit
5. Enter your Orange Money PIN
6. You will receive a confirmation SMS
7. Take a screenshot of the confirmation
8. Submit the screenshot with your deposit request

**Important Notes:**
- Minimum deposit: P50
- Maximum per transaction: P5,000
- Processing time: 5-30 minutes
- Transaction fees may apply`,
            isActive: true,
            displayOrder: 2,
        },
        {
            name: 'PayPal',
            type: 'ONLINE_PAYMENT',
            paypalEmail: 'payments@apextrade.com',
            instructions: `**PayPal Payment Instructions:**

1. Log in to your PayPal account
2. Click "Send & Request"
3. Select "Send to a friend"
4. Enter our PayPal email: **{paypalEmail}**
5. Enter the amount in USD
6. Add a note with your registered email
7. Complete the payment
8. Take a screenshot of the confirmation
9. Submit the screenshot with your deposit request

**Important Notes:**
- Minimum deposit: $10
- Processing time: Instant to 24 hours
- PayPal fees may apply
- Make sure to include your registered email in the payment note`,
            isActive: true,
            displayOrder: 3,
        },
    ];

    for (const method of paymentMethods) {
        await prisma.paymentMethod.upsert({
            where: { name: method.name },
            update: method,
            create: method,
        });
        console.log(`✓ Seeded payment method: ${method.name}`);
    }

    console.log('Payment methods seeded successfully!');
}

async function main() {
    try {
        await seedPaymentMethods();
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
