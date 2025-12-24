import Link from "next/link";
import { AddToCartButton } from "@/components/common/AddToCartButton";
import { AskAISimilarButton } from "@/components/ProductPage/AskAISimilarButton";
import { StockBadge } from "@/components/common/StockBadge";
import { formatPrice } from "@/lib/utils";
import type {
  Product,
  Category,
  ProductImage,
} from "@/app/generated/prisma/client";

interface ProductInfoProps {
  product: Product & {
    category: Category | null;
    images: ProductImage[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="flex flex-col">
      {/* Category */}
      {product.category && (
        <Link
          href={`/?category=${product.category.slug}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {product.category.title}
        </Link>
      )}

      {/* Title */}
      <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {product.name}
      </h1>

      {/* Price */}
      <p className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {formatPrice(product.price)}
      </p>

      {/* Description */}
      {product.description && (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      )}

      {/* Stock & Add to Cart */}
      <div className="mt-6 flex flex-col gap-3">
        <StockBadge productId={product.id} stock={product.stock} />
        <AddToCartButton
          productId={product.id}
          name={product.name}
          price={product.price}
          image={imageUrl ?? undefined}
          stock={product.stock}
        />
        <AskAISimilarButton productName={product.name} />
      </div>

      {/* Metadata */}
      <div className="mt-6 space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {product.material && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Material</span>
            <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {product.material}
            </span>
          </div>
        )}
        {product.color && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Color</span>
            <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {product.color}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
