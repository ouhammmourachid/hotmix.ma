"use client";
import ProductCard from "@/components/product/card/product-card";
import { useState, useEffect } from "react";
import { useApiService } from "@/services/api.service";
import Product from "@/types/product";
import { useTranslation } from '@/lib/i18n-utils';

export default function RecommendedProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApiService();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await api.product.getAll('page=1&page_size=3');
        setProducts(response.data.results);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{t('recommended_products_title')}</h2>
        </div>
        <div className="flex items-center justify-center">
          {loading ? (
            <div className="text-white">{t('loading_recommended_products')}</div>
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
