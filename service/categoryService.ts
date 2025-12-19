import { GET_CATEGORIES } from "@/lib/api";

export async function getAllCategories() {
  try {
    const response = await fetch(GET_CATEGORIES, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
