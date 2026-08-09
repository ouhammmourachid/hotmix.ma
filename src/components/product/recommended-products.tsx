"use client";
import ProductCard from "@/components/product/card/product-card";
import { useState, useEffect } from "react";
import { useApiService } from "@/services/api.service";
import Product from "@/types/product";
import { useTranslation } from '@/lib/i18n-utils';

interface RecommendedProductsProps {
  category?: string;
  currentProductId?: string;
}

export default function RecommendedProducts({ category, currentProductId }: RecommendedProductsProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApiService();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        // Fetch up to 6 products to ensure enough remain after filtering out current product
        let filterStr = 'page=1&page_size=6';
        if (category) {
          filterStr += `&category=${category}`;
        }

        const response = await api.product.getAll(filterStr);
        const filtered = response.data.results.filter(
          (product: Product) => !currentProductId || String(product.id) !== String(currentProductId)
        );
        // Ensure 3 recommended products are shown
        setProducts(filtered.slice(0, 3));
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [category, currentProductId]);

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{t('recommended_products_title')}</h2>
        </div>
        <div className="flex items-center justify-center">
          {loading ? (
            /* Skeleton grid — same dimensions as real grid, prevents CLS */
            <div className="w-full gap-4 sm:gap-5 md:gap-7 grid grid-cols-2 lg:grid-cols-3 animate-pulse">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="w-full bg-gray-700 rounded-lg" style={{ aspectRatio: '1000/1500' }} />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full gap-4 sm:gap-5 md:gap-7 grid grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
