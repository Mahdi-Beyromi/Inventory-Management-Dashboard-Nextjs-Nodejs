#!/usr/bin/env node

import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting database migration for Order Status...');

  try {
    // Check if status column already exists
    const existingColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
      AND column_name = 'status'
    `;

    if (existingColumns.length > 0) {
      console.log('✅ Status column already exists');
      return;
    }

    // Add status column
    console.log('📝 Adding status column to Order table...');
    await prisma.$executeRaw`
      ALTER TABLE "Order" 
      ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending'
    `;

    // Update existing orders to have 'pending' status
    console.log('🔄 Updating existing orders to have pending status...');
    await prisma.$executeRaw`
      UPDATE "Order" 
      SET "status" = 'pending' 
      WHERE "status" IS NULL
    `;

    // Create index for better performance
    console.log('📊 Creating index for status column...');
    await prisma.$executeRaw`
      CREATE INDEX "Order_status_idx" ON "Order"("status")
    `;

    console.log('✅ Order status migration completed successfully!');
    console.log('📋 Changes made:');
    console.log('   - Added status column with default value "pending"');
    console.log('   - Updated existing orders to have pending status');
    console.log('   - Created index for status column');

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
