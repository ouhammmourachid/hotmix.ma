"use client";
import ProductCard from "@/components/product/card/product-card";
import { useState, useEffect } from "react";
import { useApiService } from "@/services/api.service";
import Product from "@/types/product";
import { useTranslation } from '@/lib/i18n-utils';

// 4 rows: 2 per row on mobile, 4 per row from lg
const MOBILE_PRODUCTS = 8;
const MAX_PRODUCTS = 16;

// Cards past the mobile count only show from lg, so mobile stays at 4 rows too
const visibilityClass = (index: number) => (index < MOBILE_PRODUCTS ? '' : 'hidden lg:block');

interface RecommendedProductsProps {
  currentProductId?: string;
}

export default function RecommendedProducts({ currentProductId }: RecommendedProductsProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApiService();

  useEffect(() => {
    if (!currentProductId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchRecommendedProducts = async () => {
      try {
        const { data } = await api.product.getRecommended(currentProductId);
        const recommendedIds: string[] = (data.recommendations || []).map((r: { id: string }) => String(r.id));

        let ordered: Product[] = [];
        if (recommendedIds.length > 0) {
          const { data: hydrated } = await api.product.getByIds(recommendedIds);
          // getByIds doesn't guarantee order, so re-sort to match the API's relevance ranking
          const byId = new Map(hydrated.map((product: Product) => [String(product.id), product]));
          ordered = recommendedIds
            .map((id) => byId.get(id))
            .filter((product): product is Product => Boolean(product))
            .slice(0, MAX_PRODUCTS);
        }

        // The API returns only a few recommendations, so fill the remaining rows with random products
        const { data: filler } = await api.product.getRandom(
          MAX_PRODUCTS - ordered.length,
          [currentProductId, ...ordered.map((product) => String(product.id))]
        );

        if (!cancelled) setProducts([...ordered, ...filler]);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecommendedProducts();

    return () => {
      cancelled = true;
    };
  }, [currentProductId]);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{t('recommended_products_title')}</h2>
        </div>

        {loading ? (
          /* Skeleton grid — same dimensions as real grid, prevents CLS */
          <div className="w-full gap-4 sm:gap-5 md:gap-7 grid grid-cols-2 lg:grid-cols-4 animate-pulse">
            {Array.from({ length: MAX_PRODUCTS }, (_, i) => (
              <div key={i} className={`space-y-3 ${visibilityClass(i)}`}>
                <div className="w-full bg-gray-700 rounded-lg" style={{ aspectRatio: '1000/1500' }} />
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-700 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full gap-4 sm:gap-5 md:gap-7 grid grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <div key={product.id} className={visibilityClass(index)}>
                <ProductCard product={product} delay={0.05 * Math.min(index, 8)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
