import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleOrders() {
  try {
    console.log('🌱 Starting to create sample orders...');

    // Get all products to use for orders
    const products = await prisma.products.findMany();
    
    if (products.length === 0) {
      console.log('❌ No products found. Please create some products first.');
      return;
    }

    console.log(`📦 Found ${products.length} products to create orders for`);

    // Generate orders for the last 30 days
    const orders = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const orderDate = new Date(today);
      orderDate.setDate(today.getDate() - i);
      
      // Generate 1-5 orders per day (more realistic variation)
      const ordersPerDay = Math.floor(Math.random() * 5) + 1;
      
      for (let j = 0; j < ordersPerDay; j++) {
        // Random product
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        
        // Random quantity between 1-10
        const quantity = Math.floor(Math.random() * 10) + 1;
        
        // Calculate total price
        const totalPrice = parseFloat((randomProduct.price * quantity).toFixed(2));
        
        // Random time during the day
        const orderTime = new Date(orderDate);
        orderTime.setHours(
          Math.floor(Math.random() * 12) + 8, // 8 AM to 8 PM
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 60)
        );
        
        // Random status distribution (more realistic)
        const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        const statusWeights = [0.1, 0.2, 0.3, 0.35, 0.05]; // More delivered orders
        
        let status = 'pending';
        const random = Math.random();
        let cumulativeWeight = 0;
        for (let k = 0; k < statusOptions.length; k++) {
          cumulativeWeight += statusWeights[k];
          if (random <= cumulativeWeight) {
            status = statusOptions[k];
            break;
          }
        }
        
        orders.push({
          orderId: `order_${Date.now()}_${i}_${j}`,
          productId: randomProduct.productId,
          quantity,
          totalPrice,
          status,
          createdAt: orderTime,
        });
      }
    }

    console.log(`📊 Generated ${orders.length} sample orders`);

    // Insert orders in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      
      // Use createMany for better performance
      const result = await prisma.order.createMany({
        data: batch,
        skipDuplicates: true, // Skip if orderId already exists
      });
      
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${result.count} orders`);
    }

    // Update product stock quantities to reflect the orders
    console.log('🔄 Updating product stock quantities...');
    
    for (const product of products) {
      const totalOrdered = await prisma.order.aggregate({
        where: {
          productId: product.productId,
          status: {
            not: 'cancelled' // Don't count cancelled orders
          }
        },
        _sum: {
          quantity: true
        }
      });
      
      const orderedQuantity = totalOrdered._sum.quantity || 0;
      const newStock = Math.max(0, product.stockQuantity - orderedQuantity);
      
      await prisma.products.update({
        where: { productId: product.productId },
        data: { stockQuantity: newStock }
      });
    }

    console.log('✅ Sample orders created successfully!');
    console.log(`📈 Total orders created: ${orders.length}`);
    console.log(`📅 Orders span: ${orders[0]?.createdAt.toDateString()} to ${orders[orders.length - 1]?.createdAt.toDateString()}`);
    
    // Show some statistics
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true }
    });
    
    const orderCount = await prisma.order.count();
    
    console.log(`💰 Total revenue: $${totalRevenue._sum.totalPrice?.toFixed(2) || '0.00'}`);
    console.log(`📦 Total orders: ${orderCount}`);
    
  } catch (error) {
    console.error('❌ Error creating sample orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSampleOrders();
