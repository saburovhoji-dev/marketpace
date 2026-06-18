const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Admin
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@digitalhub.uz',
      password: hashedPassword,
      username: 'admin_uz',
      role: 'admin',
      balance: 1000.0,
    }
  });

  // Categories
  const categoriesData = [
    { slug: 'ai-ml', name_ru: 'ИИ и Машинное обучение', name_uz: 'Sun\'iy intellekt', name_en: 'AI & ML' },
    { slug: 'gaming', name_ru: 'Игры и Гейминг', name_uz: 'O\'yinlar', name_en: 'Gaming' },
    { slug: 'bots', name_ru: 'Боты и Скрипты', name_uz: 'Botlar va Skriptlar', name_en: 'Bots & Scripts' },
    { slug: 'design', name_ru: 'Дизайн и Графика', name_uz: 'Dizayn va Grafika', name_en: 'Design & Graphics' },
    { slug: 'smm', name_ru: 'SMM и Продвижение', name_uz: 'SMM va Targ\'ibot', name_en: 'SMM & Marketing' },
    { slug: 'development', name_ru: 'Разработка ПО', name_uz: 'Dasturlash', name_en: 'Software Development' },
    { slug: 'accounts', name_ru: 'Аккаунты и Премиум', name_uz: 'Akkauntlar va Premium', name_en: 'Accounts & Premium' }
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }

  // Products
  const productsData = [
    {
      sellerId: admin.id,
      categoryId: categories['ai-ml'].id,
      price: 49.99,
      title_ru: 'Нейросеть для генерации лиц',
      title_uz: 'Yuz generatsiyasi uchun neyrotarmoq',
      title_en: 'AI Face Generator Model',
      desc_ru: 'Профессиональная модель для создания фотореалистичных лиц.',
      desc_uz: 'Fotorealistik yuzlarni yaratish uchun professional model.',
      desc_en: 'Professional model for creating photorealistic human faces.',
      imageUrl: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=800',
    },
    {
      sellerId: admin.id,
      categoryId: categories['bots'].id,
      price: 15.00,
      title_ru: 'Telegram Бот для Магазина',
      title_uz: 'Do\'kon uchun Telegram Bot',
      title_en: 'Telegram Shop Bot',
      desc_ru: 'Полностью функциональный бот с корзиной и оплатой.',
      desc_uz: 'Savat va to\'lov tizimiga ega to\'liq funksional bot.',
      desc_en: 'Fully functional bot with cart and payment integration.',
      imageUrl: 'https://images.unsplash.com/photo-1527430253228-e92d4f37599e?auto=format&fit=crop&q=80&w=800',
    },
    {
      sellerId: admin.id,
      categoryId: categories['design'].id,
      price: 25.00,
      title_ru: 'Набор UI китов для Фигмы',
      title_uz: 'Figma uchun UI kitlar to\'plami',
      title_en: 'Modern UI Kit for Figma',
      desc_ru: 'Более 100 компонентов в стиле Glassmorphism.',
      desc_uz: 'Glassmorphism uslubidagi 100 dan ortiq komponentlar.',
      desc_en: 'Over 100 components in Glassmorphism style.',
      imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=800',
    }
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }

  console.log('Database seeded with all categories successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
