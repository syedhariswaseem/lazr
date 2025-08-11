import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample products
  const products = [
    {
      name: "Lazr Cutter Pro 5000",
      description: "High-power CO2 laser cutting system with 5000W output for industrial applications",
      price: 125000,
      category: "Industrial",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
      rating: 4.8,
      inStock: true,
      stockCount: 5
    },
    {
      name: "Fiber Laser Cutter Elite 3000",
      description: "Advanced fiber laser technology for precise metal cutting and engraving",
      price: 89000,
      category: "Metal Cutting",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
      rating: 4.9,
      inStock: true,
      stockCount: 3
    },
    {
      name: "Compact Laser Cutter Mini 1000",
      description: "Compact and portable laser cutting solution for small workshops",
      price: 45000,
      category: "Compact",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
      rating: 4.6,
      inStock: true,
      stockCount: 8
    },
    {
      name: "Automated Laser System Max 8000",
      description: "Fully automated laser cutting system with robotic material handling",
      price: 250000,
      category: "Automated",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
      rating: 4.9,
      inStock: false,
      stockCount: 0
    },
    {
      name: "3D Laser Cutter Advanced",
      description: "3D laser cutting and engraving system for complex geometries",
      price: 180000,
      category: "3D Cutting",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
      rating: 4.7,
      inStock: true,
      stockCount: 2
    },
    {
      name: "Water Jet Laser Hybrid",
      description: "Hybrid laser and water jet cutting system for versatile material processing. Combines the precision of laser cutting with the power of water jet technology.",
      price: 320000,
      category: "Hybrid",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
      rating: 4.8,
      inStock: true,
      stockCount: 1
    },
    {
      name: "Ultra-Lazr Cutter 2000",
      description: "Ultra-precision laser cutting system for micro-manufacturing applications. Designed for cutting extremely fine details with micron-level accuracy.",
      price: 150000,
      category: "Precision",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
      rating: 4.9,
      inStock: true,
      stockCount: 1
    }
  ];

  console.log('Seeding products...');
  
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 