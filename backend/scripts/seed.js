import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import foodModel from '../models/foodModel.js';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';

async function run() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }
  
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB successfully!');

  // Clear existing data
  await foodModel.deleteMany({});
  await userModel.deleteMany({});
  await orderModel.deleteMany({});
  console.log('Cleared existing data');

  // Seed foods with 4+ items in each category
  const sampleFoods = [
    // Pizza (4 items)
    { name: 'Margherita Pizza', description: 'Classic cheese & tomato with fresh basil', price: 299, image: 'pizza_margherita.jpg', category: 'Pizza' },
    { name: 'Pepperoni Pizza', description: 'Spicy pepperoni with mozzarella cheese', price: 349, image: 'pizza_pepperoni.jpg', category: 'Pizza' },
    { name: 'Veggie Supreme Pizza', description: 'Bell peppers, onions, mushrooms & olives', price: 329, image: 'pizza_veggie.jpg', category: 'Pizza' },
    { name: 'BBQ Chicken Pizza', description: 'BBQ chicken with red onions and cilantro', price: 379, image: 'pizza_bbq.jpg', category: 'Pizza' },
    
    // Burgers (4 items)
    { name: 'Classic Burger', description: 'Beef patty with lettuce, tomato & cheese', price: 249, image: 'burger_classic.jpg', category: 'Burger' },
    { name: 'Chicken Burger', description: 'Grilled chicken with mayo & vegetables', price: 229, image: 'burger_chicken.jpg', category: 'Burger' },
    { name: 'Veg Burger', description: 'Plant-based patty with fresh vegetables', price: 199, image: 'burger_veg.jpg', category: 'Burger' },
    { name: 'Fish Burger', description: 'Crispy fish fillet with tartar sauce', price: 259, image: 'burger_fish.jpg', category: 'Burger' },
    
    // Sandwiches (4 items)
    { name: 'Grilled Sandwich', description: 'Toasted bread with cheese & vegetables', price: 149, image: 'sandwich_grilled.jpg', category: 'Sandwich' },
    { name: 'Club Sandwich', description: 'Triple-decker with chicken, bacon & lettuce', price: 199, image: 'sandwich_club.jpg', category: 'Sandwich' },
    { name: 'BLT Sandwich', description: 'Bacon, lettuce, and tomato on toasted bread', price: 179, image: 'sandwich_blt.jpg', category: 'Sandwich' },
    { name: 'Tuna Sandwich', description: 'Fresh tuna salad with crisp vegetables', price: 189, image: 'sandwich_tuna.jpg', category: 'Sandwich' },
    
    // Rolls (4 items)
    { name: 'Chicken Roll', description: 'Spicy chicken with vegetables in soft bread', price: 179, image: 'roll_chicken.jpg', category: 'Rolls' },
    { name: 'Paneer Roll', description: 'Marinated paneer with onions & mint chutney', price: 159, image: 'roll_paneer.jpg', category: 'Rolls' },
    { name: 'Mutton Roll', description: 'Tender mutton pieces with spices', price: 199, image: 'roll_mutton.jpg', category: 'Rolls' },
    { name: 'Egg Roll', description: 'Scrambled eggs with vegetables and sauces', price: 139, image: 'roll_egg.jpg', category: 'Rolls' },
    
    // Pasta (4 items)
    { name: 'White Sauce Pasta', description: 'Creamy alfredo pasta with herbs', price: 229, image: 'pasta_white.jpg', category: 'Pasta' },
    { name: 'Red Sauce Pasta', description: 'Tomato-based pasta with Italian herbs', price: 209, image: 'pasta_red.jpg', category: 'Pasta' },
    { name: 'Pesto Pasta', description: 'Fresh basil pesto with pine nuts', price: 249, image: 'pasta_pesto.jpg', category: 'Pasta' },
    { name: 'Mixed Sauce Pasta', description: 'Combination of white and red sauce', price: 239, image: 'pasta_mixed.jpg', category: 'Pasta' },
    
    // Noodles (4 items)
    { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 179, image: 'noodles_hakka.jpg', category: 'Noodles' },
    { name: 'Schezwan Noodles', description: 'Spicy noodles with schezwan sauce', price: 199, image: 'noodles_schezwan.jpg', category: 'Noodles' },
    { name: 'Chow Mein', description: 'Classic Chinese stir-fried noodles', price: 189, image: 'noodles_chowmein.jpg', category: 'Noodles' },
    { name: 'Pad Thai', description: 'Thai-style noodles with tamarind sauce', price: 219, image: 'noodles_padthai.jpg', category: 'Noodles' },
    
    // Desserts (4 items)
    { name: 'Chocolate Cake', description: 'Rich dark chocolate cake slice', price: 149, image: 'cake_chocolate.jpg', category: 'Dessert' },
    { name: 'Vanilla Ice Cream', description: 'Creamy vanilla ice cream scoop', price: 89, image: 'icecream_vanilla.jpg', category: 'Dessert' },
    { name: 'Strawberry Cheesecake', description: 'Creamy cheesecake with fresh strawberries', price: 179, image: 'cake_strawberry.jpg', category: 'Dessert' },
    { name: 'Tiramisu', description: 'Italian coffee-flavored dessert', price: 199, image: 'tiramisu.jpg', category: 'Dessert' },
    
    // Beverages (4 items)
    { name: 'Cold Coffee', description: 'Iced coffee with milk and sugar', price: 99, image: 'coffee_cold.jpg', category: 'Beverage' },
    { name: 'Fresh Lime Soda', description: 'Refreshing lime with soda water', price: 69, image: 'lime_soda.jpg', category: 'Beverage' },
    { name: 'Mango Smoothie', description: 'Thick mango smoothie with yogurt', price: 119, image: 'smoothie_mango.jpg', category: 'Beverage' },
    { name: 'Green Tea', description: 'Healthy green tea with honey', price: 79, image: 'tea_green.jpg', category: 'Beverage' },
    
    // Pure Veg (4 items)
    { name: 'Veg Biryani', description: 'Aromatic rice with mixed vegetables', price: 189, image: 'biryani_veg.jpg', category: 'Pure Veg' },
    { name: 'Dal Makhani', description: 'Creamy black lentils with butter', price: 159, image: 'dal_makhani.jpg', category: 'Pure Veg' },
    { name: 'Palak Paneer', description: 'Cottage cheese in spiced spinach gravy', price: 179, image: 'palak_paneer.jpg', category: 'Pure Veg' },
    { name: 'Chole Bhature', description: 'Spicy chickpeas with fried bread', price: 149, image: 'chole_bhature.jpg', category: 'Pure Veg' }
  ];

  const insertedFoods = await foodModel.insertMany(sampleFoods);
  console.log(`Seeded ${insertedFoods.length} food items`);

  // Seed 4 new users
  const testUsers = [
    { name: 'Alex Rodriguez', email: 'alex@gmail.com', password: 'alex123' },
    { name: 'Sarah Johnson', email: 'sarah@gmail.com', password: 'sarah123' },
    { name: 'Michael Chen', email: 'michael@gmail.com', password: 'michael123' },
    { name: 'Emma Wilson', email: 'emma@gmail.com', password: 'emma123' }
  ];

  for (const userData of testUsers) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    await userModel.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      cartData: {}
    });
  }
  console.log(`Created ${testUsers.length} test users`);

  // Create sample order
  const firstUser = await userModel.findOne({ email: 'alex@gmail.com' });
  const sampleOrder = {
    userId: firstUser._id.toString(),
    items: [
      {
        name: 'Margherita Pizza',
        quantity: 1,
        price: 299
      },
      {
        name: 'Cold Coffee',
        quantity: 2,
        price: 99
      }
    ],
    amount: 497,
    address: {
      firstName: 'Alex',
      lastName: 'Rodriguez',
      email: 'alex@gmail.com',
      street: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipcode: '94102',
      country: 'USA',
      phone: '9876543210'
    },
    status: 'Food Processing',
    date: new Date(),
    payment: false
  };

  await orderModel.create(sampleOrder);
  console.log('Created sample order');

  console.log('\n=== DATABASE SEEDED SUCCESSFULLY ===');
  console.log('✅ New Users Created:');
  console.log('- alex@gmail.com / alex123');
  console.log('- sarah@gmail.com / sarah123');
  console.log('- michael@gmail.com / michael123');
  console.log('- emma@gmail.com / emma123');
  console.log('');
  console.log('🍕 Food Categories (4 items each):');
  console.log('- Pizza (4), Burger (4), Sandwich (4), Rolls (4)');
  console.log('- Pasta (4), Noodles (4), Dessert (4), Beverage (4), Pure Veg (4)');
  console.log('');
  console.log(`📊 Total: ${insertedFoods.length} food items across 9 categories`);
  
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
}); 