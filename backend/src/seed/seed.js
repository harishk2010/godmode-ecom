require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/godmode';

const products = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with Integrated Processor V1. Up to 30-hour battery life with quick charging. Crystal clear hands-free calling. Optimized for voice assistant with multipoint connection.',
    shortDescription: 'Best-in-class noise cancellation headphones',
    price: 29990,
    comparePrice: 34990,
    discount: 14,
    category: 'Electronics',
    brand: 'Sony',
    stock: 50,
    isFeatured: true,
    tags: ['headphones', 'wireless', 'noise-canceling', 'audio'],
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', alt: 'Sony WH-1000XM5' },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', alt: 'Sony WH-1000XM5 side' }
    ],
    rating: 4.8, numReviews: 324
  },
  {
    name: 'Apple MacBook Air M3',
    description: 'Supercharged by the M3 chip, MacBook Air is incredibly capable and portable. Features a stunning Liquid Retina display, up to 18 hours of battery life, 8GB unified memory.',
    shortDescription: 'Thin. Light. Incredibly capable.',
    price: 114900,
    comparePrice: 119900,
    discount: 4,
    category: 'Electronics',
    brand: 'Apple',
    stock: 25,
    isFeatured: true,
    tags: ['laptop', 'apple', 'macbook', 'M3'],
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', alt: 'MacBook Air M3' },
      { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600', alt: 'MacBook Air open' }
    ],
    rating: 4.9, numReviews: 1205
  },
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 features Nike first lifestyle Air unit to be inspired by running. A large Max Air window brings eye-catching style and cushion to your every day.',
    shortDescription: 'Lifestyle sneaker with Max Air cushioning',
    price: 12995,
    comparePrice: 15995,
    discount: 19,
    category: 'Fashion',
    brand: 'Nike',
    stock: 80,
    isFeatured: true,
    tags: ['shoes', 'sneakers', 'nike', 'air max'],
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', alt: 'Nike Air Max 270' },
      { url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600', alt: 'Nike shoes side' }
    ],
    rating: 4.5, numReviews: 892
  },
  {
    name: 'Samsung 65" 4K QLED Smart TV',
    description: 'Quantum Dot technology with 100% Color Volume brings every scene to life with vivid colors. Quantum HDR delivers extreme contrast and detail. Alexa built-in for seamless smart home control.',
    shortDescription: '65" 4K QLED with Quantum HDR',
    price: 89990,
    comparePrice: 104990,
    discount: 14,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 15,
    isFeatured: true,
    tags: ['tv', 'samsung', '4k', 'QLED', 'smart tv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', alt: 'Samsung 4K TV' },
      { url: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600', alt: 'Smart TV' }
    ],
    rating: 4.6, numReviews: 567
  },
  {
    name: 'Levi\'s 511 Slim Jeans',
    description: 'The 511 Slim has a slim fit through the thigh and leg with a small opening at the hem. Made from stretch denim for all-day comfort. Sits below the waist for a modern look.',
    shortDescription: 'Slim fit stretch jeans for everyday wear',
    price: 3499,
    comparePrice: 4999,
    discount: 30,
    category: 'Fashion',
    brand: 'Levi\'s',
    stock: 120,
    isFeatured: false,
    tags: ['jeans', 'denim', 'levis', 'slim fit'],
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', alt: 'Levis Jeans' },
      { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', alt: 'Jeans detail' }
    ],
    rating: 4.3, numReviews: 2103
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser reveals microscopic dust. Unique de-tangling technology for hair. 60 minutes run time with high torque cleaner head. Automatically senses and adapts to different floor types.',
    shortDescription: 'Laser-guided cordless vacuum cleaner',
    price: 52900,
    comparePrice: 62900,
    discount: 16,
    category: 'Home & Living',
    brand: 'Dyson',
    stock: 30,
    isFeatured: true,
    tags: ['vacuum', 'dyson', 'cordless', 'home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', alt: 'Dyson Vacuum' },
      { url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600', alt: 'Vacuum cleaning' }
    ],
    rating: 4.7, numReviews: 445
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Designed for runners, by runners. Features responsive BOOST midsole technology and a Primeknit upper that adapts to the shape of your foot with every stride.',
    shortDescription: 'High-performance running shoes',
    price: 14999,
    comparePrice: 17999,
    discount: 17,
    category: 'Sports',
    brand: 'Adidas',
    stock: 60,
    isFeatured: false,
    tags: ['running', 'shoes', 'adidas', 'ultraboost'],
    images: [
      { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600', alt: 'Adidas Ultraboost' },
      { url: 'https://images.unsplash.com/photo-1556906781-9a412961d28f?w=600', alt: 'Running shoes' }
    ],
    rating: 4.6, numReviews: 1345
  },
  {
    name: 'The Alchemist - Paulo Coelho',
    description: 'A fable about following your dream. A young Andalusian shepherd in his journey to the pyramids of Egypt after dreaming of finding a treasure there. A story about dreams, symbols, the language of omens.',
    shortDescription: 'International bestseller about pursuing your dreams',
    price: 299,
    comparePrice: 399,
    discount: 25,
    category: 'Books',
    brand: 'HarperCollins',
    stock: 200,
    isFeatured: false,
    tags: ['book', 'fiction', 'bestseller', 'paulo coelho'],
    images: [
      { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', alt: 'The Alchemist' },
      { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', alt: 'Books' }
    ],
    rating: 4.9, numReviews: 5612
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and food warmer. 14 built-in smart programs for ribs, soups, beans, rice, poultry and more.',
    shortDescription: '7-in-1 multi-use electric pressure cooker',
    price: 8999,
    comparePrice: 12999,
    discount: 31,
    category: 'Home & Living',
    brand: 'Instant Pot',
    stock: 45,
    isFeatured: false,
    tags: ['kitchen', 'pressure cooker', 'instant pot', 'cooking'],
    images: [
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', alt: 'Instant Pot' },
      { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', alt: 'Cooking pot' }
    ],
    rating: 4.7, numReviews: 3201
  },
  {
    name: 'Fitbit Charge 6',
    description: 'Track your heart rate 24/7, sleep stages, stress, and more. Built-in GPS for real-time pace and distance. Compatible with Google Maps and Google Wallet. 7-day battery life.',
    shortDescription: 'Advanced fitness tracker with built-in GPS',
    price: 14999,
    comparePrice: 17999,
    discount: 17,
    category: 'Electronics',
    brand: 'Fitbit',
    stock: 70,
    isFeatured: false,
    tags: ['fitness', 'tracker', 'smartwatch', 'health'],
    images: [
      { url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600', alt: 'Fitbit Charge 6' },
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', alt: 'Fitness tracker' }
    ],
    rating: 4.4, numReviews: 876
  },
  {
    name: 'L\'Oreal Paris Hyaluronic Acid Serum',
    description: '1.5% pure hyaluronic acid. Clinically proven to plump skin and reduce wrinkles. Lightweight formula absorbs quickly. Suitable for all skin types including sensitive skin.',
    shortDescription: 'Concentrated hyaluronic acid face serum',
    price: 799,
    comparePrice: 1299,
    discount: 38,
    category: 'Beauty',
    brand: 'L\'Oreal Paris',
    stock: 150,
    isFeatured: false,
    tags: ['skincare', 'serum', 'hyaluronic acid', 'beauty'],
    images: [
      { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', alt: 'Serum' },
      { url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600', alt: 'Skincare products' }
    ],
    rating: 4.5, numReviews: 2341
  },
  {
    name: 'LEGO Technic Bugatti Chiron',
    description: 'A stunning 1:8 scale model with a moving W16 engine with 8 pistons, 4 turbochargers, and 4 exhaust pipes. Features a working 8-speed gearbox and 3,599 pieces.',
    shortDescription: '3599-piece advanced LEGO Technic set',
    price: 17999,
    comparePrice: 19999,
    discount: 10,
    category: 'Toys',
    brand: 'LEGO',
    stock: 20,
    isFeatured: true,
    tags: ['lego', 'technic', 'bugatti', 'collectible'],
    images: [
      { url: 'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=600', alt: 'LEGO Bugatti' },
      { url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600', alt: 'LEGO pieces' }
    ],
    rating: 4.8, numReviews: 432
  },
  {
    name: 'Weber Spirit II E-310 Gas Grill',
    description: 'Three burners for 32,000 BTUs of power. 529 sq in of cooking area. GS4 grilling system for consistent results. Porcelain-enameled cast-iron cooking grates for easy cleaning.',
    shortDescription: '3-burner gas grill with 529 sq in cooking area',
    price: 42999,
    comparePrice: 49999,
    discount: 14,
    category: 'Home & Living',
    brand: 'Weber',
    stock: 10,
    isFeatured: false,
    tags: ['grill', 'BBQ', 'outdoor', 'cooking'],
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', alt: 'Gas grill' },
      { url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', alt: 'BBQ outdoor' }
    ],
    rating: 4.6, numReviews: 287
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera',
    description: '24.2 MP APS-C sensor with DIGIC X processor. 4K video recording at up to 30fps. Subject tracking powered by deep learning AI. Compact and lightweight body perfect for creators.',
    shortDescription: 'Compact mirrorless camera for creators',
    price: 64990,
    comparePrice: 74990,
    discount: 13,
    category: 'Electronics',
    brand: 'Canon',
    stock: 18,
    isFeatured: true,
    tags: ['camera', 'mirrorless', 'canon', 'photography'],
    images: [
      { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', alt: 'Canon Camera' },
      { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600', alt: 'Camera photography' }
    ],
    rating: 4.7, numReviews: 543
  },
  {
    name: 'Protein Whey Isolate 5lb - Optimum Nutrition',
    description: '25g protein per serving with less than 1g of sugar and fat. Instantized for easy mixing. Available in chocolate, vanilla, and strawberry flavors. 74 servings per container.',
    shortDescription: 'Gold standard 100% whey protein isolate',
    price: 4999,
    comparePrice: 6499,
    discount: 23,
    category: 'Sports',
    brand: 'Optimum Nutrition',
    stock: 90,
    isFeatured: false,
    tags: ['protein', 'whey', 'supplement', 'fitness'],
    images: [
      { url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600', alt: 'Protein powder' },
      { url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600', alt: 'Gym supplement' }
    ],
    rating: 4.5, numReviews: 4521
  },
  {
    name: 'Organic Matcha Green Tea Powder',
    description: 'Ceremonial grade A matcha from Uji, Japan. Stone-ground from shade-grown tencha leaves. Rich in antioxidants and L-theanine. Perfect for lattes, smoothies and traditional tea.',
    shortDescription: 'Premium ceremonial grade matcha from Japan',
    price: 899,
    comparePrice: 1299,
    discount: 31,
    category: 'Food',
    brand: 'Ippodo',
    stock: 100,
    isFeatured: false,
    tags: ['matcha', 'green tea', 'organic', 'japanese'],
    images: [
      { url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', alt: 'Matcha powder' },
      { url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600', alt: 'Matcha latte' }
    ],
    rating: 4.6, numReviews: 891
  }
];

const coupons = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minOrderAmount: 500, maxDiscount: 500, usageLimit: 1000 },
  { code: 'SAVE20', type: 'percentage', value: 20, minOrderAmount: 2000, maxDiscount: 1000, usageLimit: 500 },
  { code: 'FLAT500', type: 'fixed', value: 500, minOrderAmount: 3000, usageLimit: 200 },
  { code: 'GODMODE', type: 'percentage', value: 15, minOrderAmount: 1000, maxDiscount: 750, usageLimit: 5000 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    // const adminPassword = await bcrypt.hash('admin123', 12);
        // const adminPassword = await bcrypt.hash('admin123', 12);
    const adminPassword = 'admin123';
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@godmode.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create sample user
    // const userPassword = await bcrypt.hash('user1234', 12);
    const userPassword = 'user1234';
    await User.create({
      name: 'John Doe',
      email: 'user@godmode.com',
      password: userPassword,
      role: 'user',
    });

    console.log('👤 Users created');

    // Create products
    // await Product.insertMany(products);
    for (const p of products) { await Product.create(p); }

    console.log(`📦 ${products.length} Products created`);

    // Create coupons
    await Coupon.insertMany(coupons);
    console.log(`🎟️  ${coupons.length} Coupons created`);

    console.log('\n🚀 Seeding complete!');
    console.log('📧 Admin: admin@godmode.com / admin123');
    console.log('📧 User:  user@godmode.com / user1234');
    console.log('🎟️  Coupons: WELCOME10, SAVE20, FLAT500, GODMODE');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
