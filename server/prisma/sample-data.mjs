import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    console.log('🌱 Starting to create sample data...');

    // Check if products already exist
    const existingProducts = await prisma.products.count();
    
    if (existingProducts === 0) {
      console.log('📦 No products found. Creating sample products...');
      
      const sampleProducts = [
        {
          name: "Laptop Pro X1",
          description: "High-performance laptop for professionals",
          price: 1299.99,
          category: "Electronics",
          stockQuantity: 25,
          supplier: "TechCorp Inc.",
          reorderPoint: 10
        },
        {
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse with precision tracking",
          price: 49.99,
          category: "Electronics",
          stockQuantity: 50,
          supplier: "TechCorp Inc.",
          reorderPoint: 15
        },
        {
          name: "Office Chair",
          description: "Comfortable ergonomic office chair",
          price: 299.99,
          category: "Furniture",
          stockQuantity: 15,
          supplier: "OfficeMax",
          reorderPoint: 5
        },
        {
          name: "Desk Lamp",
          description: "Adjustable LED desk lamp with USB port",
          price: 79.99,
          category: "Furniture",
          stockQuantity: 30,
          supplier: "OfficeMax",
          reorderPoint: 10
        },
        {
          name: "Coffee Mug Set",
          description: "Set of 4 ceramic coffee mugs",
          price: 24.99,
          category: "Kitchen",
          stockQuantity: 100,
          supplier: "HomeGoods",
          reorderPoint: 20
        },
        {
          name: "Notebook Pack",
          description: "Pack of 10 spiral-bound notebooks",
          price: 19.99,
          category: "Office Supplies",
          stockQuantity: 75,
          supplier: "OfficeMax",
          reorderPoint: 25
        },
        {
          name: "Bluetooth Headphones",
          description: "Noise-cancelling wireless headphones",
          price: 199.99,
          category: "Electronics",
          stockQuantity: 20,
          supplier: "TechCorp Inc.",
          reorderPoint: 8
        },
        {
          name: "Stapler",
          description: "Heavy-duty office stapler",
          price: 12.99,
          category: "Office Supplies",
          stockQuantity: 60,
          supplier: "OfficeMax",
          reorderPoint: 15
        },
        {
          name: "Water Bottle",
          description: "Insulated stainless steel water bottle",
          price: 34.99,
          category: "Kitchen",
          stockQuantity: 40,
          supplier: "HomeGoods",
          reorderPoint: 10
        },
        {
          name: "Monitor Stand",
          description: "Adjustable monitor stand with cable management",
          price: 89.99,
          category: "Furniture",
          stockQuantity: 12,
          supplier: "OfficeMax",
          reorderPoint: 5
        }
      ];

      const createdProducts = await prisma.products.createMany({
        data: sampleProducts
      });

      console.log(`✅ Created ${createdProducts.count} sample products`);
    } else {
      console.log(`📦 Found ${existingProducts} existing products`);
    }

    // Get all products to use for orders
    const products = await prisma.products.findMany();
    
    // Check if orders already exist
    const existingOrders = await prisma.order.count();
    
    if (existingOrders === 0) {
      console.log('📊 No orders found. Creating sample orders...');
      
      // Generate orders for the last 30 days
      const orders = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const orderDate = new Date(today);
        orderDate.setDate(today.getDate() - i);
        
        // Generate 1-8 orders per day (more realistic variation)
        const ordersPerDay = Math.floor(Math.random() * 8) + 1;
        
        for (let j = 0; j < ordersPerDay; j++) {
          // Random product
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          
          // Random quantity between 1-15
          const quantity = Math.floor(Math.random() * 15) + 1;
          
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
          const statusWeights = [0.08, 0.15, 0.25, 0.47, 0.05]; // More delivered orders
          
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
      
    } else {
      console.log(`📊 Found ${existingOrders} existing orders`);
    }

    // Show final statistics
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true }
    });
    
    const orderCount = await prisma.order.count();
    const productCount = await prisma.products.count();
    
    console.log('\n📊 Final Database Statistics:');
    console.log(`📦 Total products: ${productCount}`);
    console.log(`📈 Total orders: ${orderCount}`);
    console.log(`💰 Total revenue: $${totalRevenue._sum.totalPrice?.toFixed(2) || '0.00'}`);
    
    // Show some low inventory items
    const lowInventoryItems = await prisma.products.findMany({
      where: {
        stockQuantity: {
          lt: 10
        }
      },
      orderBy: {
        stockQuantity: 'asc'
      },
      take: 5
    });
    
    if (lowInventoryItems.length > 0) {
      console.log('\n⚠️  Low Inventory Items:');
      lowInventoryItems.forEach(item => {
        console.log(`   - ${item.name}: ${item.stockQuantity} units (${item.category})`);
      });
    }
    
    console.log('\n🎉 Sample data creation completed successfully!');
    console.log('💡 You can now test the Dashboard with Sales Report and Low Inventory Report.');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSampleData();
