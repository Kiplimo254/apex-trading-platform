import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addUSDT() {
    console.log('Adding USDT (TRC20) payment method...');

    const usdtMethod = {
        name: 'USDT (TRC20)',
        type: 'CRYPTO',
        walletAddress: 'TN2Y3K8d1VzNMALqVMkLg1BbWfVnqBR3Nz', // Placeholder
        instructions: `**USDT (TRC20) Payment Instructions:**

1. Open your crypto wallet (Trust Wallet, Binance, etc.)
2. Select "Send" or "Transfer"
3. Choose USDT (TRC20) - **Important: Must be TRC20 network**
4. Enter the wallet address below
5. Enter the amount you want to deposit
6. Double-check the address and network
7. Confirm the transaction
8. Copy the transaction hash/ID
9. Submit your deposit request with the transaction hash

**Wallet Address:**
{walletAddress}

**Important Notes:**
- Minimum deposit: $50 USDT
- Network: TRC20 (TRON network)
- Wrong network = Lost funds!
- Processing time: 5-15 minutes after 1 confirmation
- Keep your transaction hash for verification`,
        isActive: true,
        displayOrder: 4,
    };

    await prisma.paymentMethod.upsert({
        where: { name: 'USDT (TRC20)' },
        update: usdtMethod,
        create: usdtMethod,
    });

    console.log('✓ USDT (TRC20) payment method added successfully!');
}

async function main() {
    try {
        await addUSDT();
    } catch (error) {
        console.error('Error adding USDT:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
