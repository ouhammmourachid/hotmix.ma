"use client";

import ProductCard from "@/components/product/card/product-card";
import { useRecentlyViewed } from "@/contexts/recently-viewed-context";
import { useTranslation } from '@/lib/i18n-utils';

interface RecentlyViewedProductsProps {
  currentProductId?: string;
}

export default function RecentlyViewedProducts({ currentProductId }: RecentlyViewedProductsProps) {
    const { t } = useTranslation();
    const { recentlyViewed } = useRecentlyViewed();

    const filteredProducts = currentProductId
        ? recentlyViewed.filter((product) => String(product.id) !== String(currentProductId))
        : recentlyViewed;

    // Don't render anything — this data comes from context so no layout shift risk
    // (context is hydrated before paint, so filteredProducts.length is known immediately)
    if (filteredProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-10 md:py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                        {t('recently_viewed_title')}
                    </h2>
                </div>
                <div className="w-full gap-4 sm:gap-5 md:gap-7 grid grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
