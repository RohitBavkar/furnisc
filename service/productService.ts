import type {
  Category,
  Product,
  ProductImage,
} from "@/app/generated/prisma/client";
import {
  GET_FEATURED_PRODUCTS,
  GET_FILTERED_PRODUCTS,
  GET_PRODUCT_BY_SLUG,
} from "@/lib/api";

export async function getFeaturedProducts() {
  try {
    const response = await fetch(GET_FEATURED_PRODUCTS);

    if (!response.ok) {
      throw new Error("Failed to fetch featured products");
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export type ProductWithRelations = Product & {
  category: Category | null;
  images: ProductImage[];
};

export async function getProductBySlug(
  slug: string
): Promise<ProductWithRelations | null> {
  try {
    const response = await fetch(GET_PRODUCT_BY_SLUG(slug), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const { data } = (await response.json()) as {
      data?: ProductWithRelations;
    };
    return data ?? null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

interface FilterOptions {
  searchQuery?: string;
  categorySlug?: string;
  color?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
}

export async function getFilteredProducts({
  searchQuery,
  categorySlug,
  color,
  material,
  minPrice = 0,
  maxPrice = 0,
  inStock = false,
  sort = "name",
}: FilterOptions) {
  try {
    const params = new URLSearchParams();

    if (searchQuery) params.append("q", searchQuery);
    if (categorySlug) params.append("category", categorySlug);
    if (color) params.append("color", color);
    if (material) params.append("material", material);
    if (minPrice > 0) params.append("minPrice", minPrice.toString());
    if (maxPrice > 0) params.append("maxPrice", maxPrice.toString());
    if (inStock) params.append("inStock", "true");
    if (sort) params.append("sort", sort);

    const response = await fetch(`${GET_FILTERED_PRODUCTS}?${params}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch filtered products");
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
}
