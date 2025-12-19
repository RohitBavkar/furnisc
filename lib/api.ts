const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const GET_FEATURED_PRODUCTS = `${API_URL}/api/products/featured`;
export const GET_FILTERED_PRODUCTS = `${API_URL}/api/products/filtered`;
export const GET_CATEGORIES = `${API_URL}/api/categories`;
