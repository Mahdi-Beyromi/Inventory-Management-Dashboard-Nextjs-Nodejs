# Prisma Database Scripts

This directory contains various database management scripts for the Inventory Management Dashboard.

## Available Scripts

### 1. `sample-data.mjs` - Complete Sample Data Setup
**Command:** `npm run sample:data`

Creates a complete sample dataset including:
- 10 sample products across different categories (Electronics, Furniture, Kitchen, Office Supplies)
- Sample orders for the last 30 days (1-8 orders per day)
- Realistic order statuses and quantities
- Updated stock quantities based on orders
- Comprehensive database statistics

**Use this script if you want to populate your database with realistic data for testing.**

### 2. `sample-orders.mjs` - Orders Only
**Command:** `npm run sample:orders`

Creates sample orders only (requires existing products):
- Generates orders for the last 30 days
- Updates product stock quantities
- Shows order statistics

**Use this script if you already have products and just want to add sample orders.**

### 3. `migrate-orders.mjs` - Create Orders Table
**Command:** `npm run migrate:orders`

Creates the `Order` table in the database:
- Required before running sample order scripts
- Sets up the basic table structure

### 4. `migrate-order-status.mjs` - Add Status Field
**Command:** `npm run migrate:order-status`

Adds the `status` field to existing orders:
- Updates the Order table schema
- Sets default status for existing orders

## Usage Instructions

### Prerequisites
1. Ensure your database is running
2. Run `npx prisma generate` to update Prisma client
3. Make sure your `.env` file has the correct database connection

### Step-by-Step Setup

1. **First time setup:**
   ```bash
   cd server
   npm run migrate:orders
   npm run migrate:order-status
   npm run sample:data
   ```

2. **If you just want to add more orders:**
   ```bash
   cd server
   npm run sample:orders
   ```

3. **If you want to start fresh:**
   ```bash
   cd server
   npm run sample:data
   ```

## Sample Data Details

### Products Created
- **Electronics**: Laptop Pro X1, Wireless Mouse, Bluetooth Headphones
- **Furniture**: Office Chair, Desk Lamp, Monitor Stand
- **Kitchen**: Coffee Mug Set, Water Bottle
- **Office Supplies**: Notebook Pack, Stapler

### Order Characteristics
- **Time Span**: Last 30 days
- **Orders per Day**: 1-8 (randomized)
- **Quantities**: 1-15 units per order
- **Statuses**: Realistic distribution (47% delivered, 25% shipped, etc.)
- **Stock Impact**: Automatically reduces product stock quantities

### Expected Results
After running the scripts, you should see:
- ~150-240 sample orders
- Realistic sales data for the Dashboard
- Low inventory items for testing alerts
- Proper stock quantities reflecting orders

## Troubleshooting

### Common Issues

1. **"No products found" error:**
   - Run `npm run sample:data` instead of `npm run sample:orders`
   - This will create products first, then orders

2. **Database connection errors:**
   - Check your `.env` file
   - Ensure PostgreSQL is running
   - Verify database credentials

3. **Prisma client errors:**
   - Run `npx prisma generate`
   - Restart your development server

### Reset Database (if needed)
```bash
npx prisma migrate reset
npm run sample:data
```

## Notes

- Scripts are idempotent - they won't create duplicates
- Stock quantities are automatically calculated based on order history
- Orders span the last 30 days for realistic sales reporting
- All data is sample data and can be safely deleted for production use
