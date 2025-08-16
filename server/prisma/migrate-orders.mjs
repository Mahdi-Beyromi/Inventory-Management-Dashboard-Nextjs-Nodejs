#!/usr/bin/env node

import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting database migration for Orders...');

  try {
    // Check if Orders table already exists
    const existingTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Order'
    `;

    if (existingTables.length > 0) {
      console.log('✅ Orders table already exists');
      return;
    }

    // Create Orders table
    console.log('📝 Creating Orders table...');
    await prisma.$executeRaw`
      CREATE TABLE "Order" (
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "totalPrice" DOUBLE PRECISION NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
      )
    `;

    // Add foreign key constraint
    console.log('🔗 Adding foreign key constraint...');
    await prisma.$executeRaw`
      ALTER TABLE "Order" 
      ADD CONSTRAINT "Order_productId_fkey" 
      FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE
    `;

    // Create index for better performance
    console.log('📊 Creating indexes...');
    await prisma.$executeRaw`
      CREATE INDEX "Order_productId_idx" ON "Order"("productId")
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt")
    `;

    console.log('✅ Orders table created successfully!');
    console.log('📋 Table structure:');
    console.log('   - orderId: TEXT (Primary Key, UUID)');
    console.log('   - productId: TEXT (Foreign Key to Products)');
    console.log('   - quantity: INTEGER');
    console.log('   - totalPrice: DOUBLE PRECISION');
    console.log('   - createdAt: TIMESTAMP');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
