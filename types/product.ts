export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  order: number;
  productId: string;
}

export interface ProductCategory {
  title: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  images?: ProductImage[];
  category?: ProductCategory;
}
