import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool, {
  schema: "furnexa",
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Seed Categories
  console.log("📁 Seeding categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: "category-sofas",
        title: "Sofas",
        slug: "sofas",
        imageUrl:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
      },
    }),
    prisma.category.create({
      data: {
        id: "category-chairs",
        title: "Chairs",
        slug: "chairs",
        imageUrl:
          "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
      },
    }),
    prisma.category.create({
      data: {
        id: "category-tables",
        title: "Tables",
        slug: "tables",
        imageUrl:
          "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800",
      },
    }),
    prisma.category.create({
      data: {
        id: "category-beds",
        title: "Beds",
        slug: "beds",
        imageUrl:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
      },
    }),
    prisma.category.create({
      data: {
        id: "category-storage",
        title: "Storage",
        slug: "storage",
        imageUrl:
          "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800",
      },
    }),
    prisma.category.create({
      data: {
        id: "category-lighting",
        title: "Lighting",
        slug: "lighting",
        imageUrl:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // Seed Products with Images
  console.log("🛋️  Seeding products...");

  // Sofas
  await prisma.product.create({
    data: {
      id: "product-nordic-grey-sofa",
      name: "Nordic Grey 3-Seater Sofa",
      slug: "nordic-grey-sofa",
      description:
        "A stunning Scandinavian-inspired sofa featuring clean lines and plush cushioning. The Nordic Grey Sofa combines timeless design with exceptional comfort, perfect for modern living spaces. Upholstered in premium bouclé fabric with solid oak legs.",
      price: 1299.99,
      stock: 12,
      featured: true,
      categoryId: "category-sofas",
      material: "fabric",
      color: "grey",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
            order: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1200",
            order: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-leather-chesterfield",
      name: "Vintage Leather Chesterfield",
      slug: "leather-chesterfield",
      description:
        "Classic British craftsmanship meets luxury in this hand-tufted Chesterfield sofa. Made from full-grain leather that develops a beautiful patina over time. Features traditional button detailing and rolled arms.",
      price: 2499.99,
      stock: 5,
      featured: true,
      categoryId: "category-sofas",
      material: "leather",
      color: "walnut",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200",
            order: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200",
            order: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-minimalist-white-sofa",
      name: "Minimalist White Linen Sofa",
      slug: "minimalist-white-sofa",
      description:
        "Pure simplicity in design. This minimalist sofa features removable linen covers for easy cleaning, making it perfect for families. Low-profile design with hidden metal legs creates a floating appearance.",
      price: 899.99,
      stock: 18,
      featured: false,
      categoryId: "category-sofas",
      material: "fabric",
      color: "white",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-velvet-emerald-sofa",
      name: "Velvet Emerald Statement Sofa",
      slug: "velvet-emerald-sofa",
      description:
        "Make a bold statement with this luxurious emerald velvet sofa. Art deco inspired design with channel tufting and brass-finished legs. A showstopper piece that transforms any room.",
      price: 1799.99,
      stock: 3,
      featured: true,
      categoryId: "category-sofas",
      material: "fabric",
      color: "natural",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  // Chairs
  await prisma.product.create({
    data: {
      id: "product-oak-dining-chair",
      name: "Solid Oak Dining Chair",
      slug: "oak-dining-chair",
      description:
        "Handcrafted from sustainable solid oak, this dining chair combines durability with elegant design. Curved backrest provides excellent lumbar support. Sold individually - perfect for mixing and matching.",
      price: 249.99,
      stock: 48,
      featured: false,
      categoryId: "category-chairs",
      material: "wood",
      color: "oak",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200",
            order: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1549497538-303791108f95?w=1200",
            order: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-ergonomic-office-chair",
      name: "Executive Ergonomic Office Chair",
      slug: "ergonomic-office-chair",
      description:
        "Premium office chair designed for all-day comfort. Features adjustable lumbar support, 4D armrests, breathable mesh back, and synchronized tilt mechanism. BIFMA certified for durability.",
      price: 599.99,
      stock: 25,
      featured: true,
      categoryId: "category-chairs",
      material: "metal",
      color: "black",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-leather-accent-chair",
      name: "Cognac Leather Accent Chair",
      slug: "leather-accent-chair",
      description:
        "Mid-century modern accent chair in rich cognac leather. Features a solid walnut wood frame with hand-stitched leather upholstery. A timeless piece that adds warmth to any space.",
      price: 749.99,
      stock: 8,
      featured: true,
      categoryId: "category-chairs",
      material: "leather",
      color: "walnut",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-rattan-lounge-chair",
      name: "Natural Rattan Lounge Chair",
      slug: "rattan-lounge-chair",
      description:
        "Bring bohemian charm to your home with this handwoven rattan lounge chair. Lightweight yet sturdy, perfect for sunrooms, patios, or reading nooks. Includes cream linen cushion.",
      price: 449.99,
      stock: 15,
      featured: false,
      categoryId: "category-chairs",
      material: "wood",
      color: "natural",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  // Tables
  await prisma.product.create({
    data: {
      id: "product-walnut-dining-table",
      name: "Walnut Extending Dining Table",
      slug: "walnut-dining-table",
      description:
        "Elegant walnut dining table that extends from 180cm to 240cm, seating up to 10 guests. Features a butterfly leaf extension system and tapered legs. Protected with a durable matte lacquer finish.",
      price: 1499.99,
      stock: 7,
      featured: true,
      categoryId: "category-tables",
      material: "wood",
      color: "walnut",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=1200",
            order: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200",
            order: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-marble-coffee-table",
      name: "Carrara Marble Coffee Table",
      slug: "marble-coffee-table",
      description:
        "Luxurious coffee table featuring a genuine Carrara marble top with distinctive grey veining. Supported by a sleek brushed brass base. Each piece is unique due to the natural stone variations.",
      price: 899.99,
      stock: 4,
      featured: true,
      categoryId: "category-tables",
      material: "glass",
      color: "white",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-industrial-console",
      name: "Industrial Console Table",
      slug: "industrial-console",
      description:
        "Raw industrial style meets refined design. Reclaimed elm wood top paired with blackened steel frame. Perfect for hallways, behind sofas, or as a home bar setup.",
      price: 549.99,
      stock: 11,
      featured: false,
      categoryId: "category-tables",
      material: "metal",
      color: "black",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-glass-side-table",
      name: "Tempered Glass Side Table",
      slug: "glass-side-table",
      description:
        "Minimalist side table with 12mm tempered glass top and brushed stainless steel legs. The transparent design keeps your space feeling open and airy. Set of 2.",
      price: 299.99,
      stock: 22,
      featured: false,
      categoryId: "category-tables",
      material: "glass",
      color: "white",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  // Beds
  await prisma.product.create({
    data: {
      id: "product-oak-platform-bed",
      name: "Japanese Oak Platform Bed",
      slug: "oak-platform-bed",
      description:
        "Zen-inspired platform bed in solid white oak. Low-profile design with integrated nightstands. No box spring required - slat system provides excellent mattress support and ventilation. Available in King and Super King.",
      price: 1899.99,
      stock: 6,
      featured: true,
      categoryId: "category-beds",
      material: "wood",
      color: "oak",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
            order: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=1200",
            order: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-upholstered-bed-frame",
      name: "Velvet Upholstered Bed Frame",
      slug: "upholstered-bed-frame",
      description:
        "Hotel-luxury bed frame with deep button-tufted headboard in soft grey velvet. Solid wood frame construction with reinforced center support. Creates a stunning focal point for any bedroom.",
      price: 1299.99,
      stock: 9,
      featured: true,
      categoryId: "category-beds",
      material: "fabric",
      color: "grey",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-four-poster-bed",
      name: "Modern Four Poster Bed",
      slug: "four-poster-bed",
      description:
        "Contemporary take on the classic four-poster bed. Clean-lined black metal frame creates architectural interest without overwhelming the space. Compatible with canopy drapes for a romantic touch.",
      price: 999.99,
      stock: 0,
      featured: false,
      categoryId: "category-beds",
      material: "metal",
      color: "black",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  // Storage
  await prisma.product.create({
    data: {
      id: "product-oak-wardrobe",
      name: "Scandinavian Oak Wardrobe",
      slug: "oak-wardrobe",
      description:
        "Spacious double wardrobe in light oak with soft-close doors. Interior features adjustable shelving, full-width hanging rail, and built-in drawers. Minimalist design fits seamlessly into modern bedrooms.",
      price: 1199.99,
      stock: 4,
      featured: true,
      categoryId: "category-storage",
      material: "wood",
      color: "oak",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-industrial-bookshelf",
      name: "Industrial Ladder Bookshelf",
      slug: "industrial-bookshelf",
      description:
        "Five-tier ladder bookshelf combining rustic wood shelves with sturdy metal frame. Leaning design saves floor space while providing ample storage. Perfect for books, plants, and decorative objects.",
      price: 349.99,
      stock: 16,
      featured: false,
      categoryId: "category-storage",
      material: "metal",
      color: "black",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-media-console",
      name: "Walnut Media Console",
      slug: "media-console",
      description:
        "Mid-century inspired TV console in rich walnut veneer. Features slatted sliding doors that hide cables and devices, open center shelf, and integrated cable management. Supports TVs up to 75 inches.",
      price: 799.99,
      stock: 10,
      featured: true,
      categoryId: "category-storage",
      material: "wood",
      color: "walnut",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-modular-shelving",
      name: "Modular Cube Shelving System",
      slug: "modular-shelving",
      description:
        "Versatile cube storage system that you can configure to fit your space. Each module connects seamlessly. Available in white, oak, or walnut finish. Set of 6 cubes.",
      price: 449.99,
      stock: 20,
      featured: false,
      categoryId: "category-storage",
      material: "wood",
      color: "white",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  // Lighting
  await prisma.product.create({
    data: {
      id: "product-arc-floor-lamp",
      name: "Brass Arc Floor Lamp",
      slug: "arc-floor-lamp",
      description:
        "Iconic arc floor lamp in brushed brass with white linen drum shade. Adjustable arm extends up to 200cm, perfect for lighting over sofas and reading chairs. Marble base ensures stability.",
      price: 449.99,
      stock: 14,
      featured: true,
      categoryId: "category-lighting",
      material: "metal",
      color: "natural",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-pendant-cluster",
      name: "Glass Globe Pendant Cluster",
      slug: "pendant-cluster",
      description:
        "Statement lighting cluster featuring 5 hand-blown glass globes at varying heights. Creates beautiful ambient lighting over dining tables or in entryways. Compatible with smart bulbs.",
      price: 599.99,
      stock: 7,
      featured: true,
      categoryId: "category-lighting",
      material: "glass",
      color: "white",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-table-lamp-ceramic",
      name: "Ceramic Table Lamp",
      slug: "ceramic-table-lamp",
      description:
        "Artisan-made ceramic table lamp with reactive glaze finish - each piece is unique. Topped with natural linen shade. Perfect bedside or accent lighting. LED bulb included.",
      price: 179.99,
      stock: 30,
      featured: false,
      categoryId: "category-lighting",
      material: "glass",
      color: "grey",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-wall-sconce",
      name: "Industrial Wall Sconce Pair",
      slug: "wall-sconce",
      description:
        "Pair of adjustable wall sconces in matte black finish with exposed Edison bulbs. Swing-arm design allows directional lighting. Hardwired or plug-in installation options. Bulbs included.",
      price: 199.99,
      stock: 24,
      featured: false,
      categoryId: "category-lighting",
      material: "metal",
      color: "black",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1200",
            order: 0,
          },
        ],
      },
    },
  });

  console.log("✅ Created 26 products with images");

  // Seed Customers
  console.log("👥 Seeding customers...");
  await prisma.customer.create({
    data: {
      id: "customer-sample-1",
      clerkUserId: "user_clerk_emma_wilson",
      email: "emma.wilson@example.com",
      name: "Emma Wilson",
      createdAt: new Date("2024-11-15T10:30:00.000Z"),
    },
  });

  await prisma.customer.create({
    data: {
      id: "customer-sample-2",
      clerkUserId: "user_clerk_james_chen",
      email: "james.chen@example.com",
      name: "James Chen",
      createdAt: new Date("2024-11-20T14:15:00.000Z"),
    },
  });

  await prisma.customer.create({
    data: {
      id: "customer-sample-3",
      clerkUserId: "user_clerk_sarah_miller",
      email: "sarah.miller@example.com",
      name: "Sarah Miller",
      createdAt: new Date("2024-12-01T09:45:00.000Z"),
    },
  });

  console.log("✅ Created 3 customers");

  // Seed Orders
  console.log("📦 Seeding orders...");
  await prisma.order.create({
    data: {
      id: "order-sample-1",
      orderNumber: "ORD-2024-001",
      status: "delivered",
      total: 1549.98,
      customerId: "customer-sample-1",
      createdAt: new Date("2024-11-15T10:35:00.000Z"),
      items: {
        create: [
          {
            productId: "product-nordic-grey-sofa",
            quantity: 1,
            priceAtPurchase: 1299.99,
          },
          {
            productId: "product-oak-dining-chair",
            quantity: 1,
            priceAtPurchase: 249.99,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: "order-sample-2",
      orderNumber: "ORD-2024-002",
      status: "shipped",
      total: 899.99,
      customerId: "customer-sample-2",
      createdAt: new Date("2024-12-01T11:20:00.000Z"),
      items: {
        create: [
          {
            productId: "product-marble-coffee-table",
            quantity: 1,
            priceAtPurchase: 899.99,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: "order-sample-3",
      orderNumber: "ORD-2024-003",
      status: "paid",
      total: 2199.98,
      customerId: "customer-sample-3",
      createdAt: new Date("2024-12-05T16:45:00.000Z"),
      items: {
        create: [
          {
            productId: "product-oak-platform-bed",
            quantity: 1,
            priceAtPurchase: 1899.99,
          },
          {
            productId: "product-glass-side-table",
            quantity: 1,
            priceAtPurchase: 299.99,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: "order-sample-4",
      orderNumber: "ORD-2024-004",
      status: "paid",
      total: 749.99,
      customerId: "customer-sample-1",
      createdAt: new Date("2024-12-06T09:10:00.000Z"),
      items: {
        create: [
          {
            productId: "product-leather-accent-chair",
            quantity: 1,
            priceAtPurchase: 749.99,
          },
        ],
      },
    },
  });

  console.log("✅ Created 4 orders with items");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
