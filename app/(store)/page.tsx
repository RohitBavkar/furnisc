import { FeaturedCarousel } from "@/components/app/FeaturedCarousel";
import { FeaturedCarouselSkeleton } from "@/components/app/FeaturedCarouselSkeleton";
import { Suspense } from "react";
import { getFeaturedProducts } from "@/service/productService";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  console.log("Featured Products:", featuredProducts.length);
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <Suspense fallback={<FeaturedCarouselSkeleton />}>
          <FeaturedCarousel products={featuredProducts} />
        </Suspense>
      )}
    </div>
  );
}
