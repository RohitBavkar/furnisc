import { successResponse, handleApiError } from "@/lib/response";
import DB from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const searchQuery = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category") || "";
    const color = searchParams.get("color") || "";
    const material = searchParams.get("material") || "";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 0;
    const inStock = searchParams.get("inStock") === "true";
    const sort = searchParams.get("sort") || "name";

    // Build Prisma query filters
    const whereClause: any = {};

    // Search filter
    if (searchQuery) {
      whereClause.name = {
        contains: searchQuery,
        mode: "insensitive",
      };
    }

    // Category filter
    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    // Color filter
    if (color) {
      whereClause.color = color;
    }

    // Material filter
    if (material) {
      whereClause.material = material;
    }

    // Price range filter
    if (minPrice > 0 || maxPrice > 0) {
      whereClause.price = {};
      if (minPrice > 0) whereClause.price.gte = minPrice;
      if (maxPrice > 0) whereClause.price.lte = maxPrice;
    }

    // Stock filter
    if (inStock) {
      whereClause.stock = {
        gt: 0,
      };
    }

    // Determine sort order
    let orderBy: any = { name: "asc" };
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "relevance":
      case "name":
      default:
        orderBy = { name: "asc" };
        break;
    }

    // Fetch products with filters
    const products = await DB.product.findMany({
      where: whereClause,
      orderBy,
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return successResponse(products);
  } catch (error) {
    return handleApiError(error, "Error fetching filtered products");
  }
}
