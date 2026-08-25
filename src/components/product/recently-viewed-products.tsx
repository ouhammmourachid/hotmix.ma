"use client";

import ProductCard from "@/components/product/card/product-card";
import { useRecentlyViewed } from "@/contexts/recently-viewed-context";
import { useTranslation } from '@/lib/i18n-utils';
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Matches the grid's `grid-cols-2 lg:grid-cols-3` breakpoint (Tailwind's default lg = 1024px),
// so each page always fills its rows exactly — no lone card wrapping onto its own row.
const DESKTOP_PAGE_SIZE = 3;
const MOBILE_PAGE_SIZE = 2;
const LG_BREAKPOINT_QUERY = '(min-width: 1024px)';

interface RecentlyViewedProductsProps {
  currentProductId?: string;
}

export default function RecentlyViewedProducts({ currentProductId }: RecentlyViewedProductsProps) {
  const { t } = useTranslation();
  const { recentlyViewed } = useRecentlyViewed();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(MOBILE_PAGE_SIZE);
  const [imageCenter, setImageCenter] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const filteredProducts = currentProductId
    ? recentlyViewed.filter((product) => String(product.id) !== String(currentProductId))
    : recentlyViewed;

  useEffect(() => {
    const mql = window.matchMedia(LG_BREAKPOINT_QUERY);
    const update = () => {
      setPageSize(mql.matches ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE);
      setPage(0);
    };

    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [currentProductId]);

  // Arrows should sit at the vertical center of the product image only, not the
  // whole card (image + name + price) — that image height varies per breakpoint,
  // so measure the rendered image instead of guessing a fixed percentage.
  useEffect(() => {
    if (filteredProducts.length === 0) return;

    const updateImageCenter = () => {
      const container = sliderRef.current;
      const img = container?.querySelector('img');
      if (!container || !img) return;

      // ProductCard plays a translateY entrance animation on mount, which
      // getBoundingClientRect() would pick up mid-transition and bake into the
      // arrow position permanently. offsetTop is a layout value — it ignores
      // CSS transforms — so it stays correct regardless of the animation.
      let top = 0;
      let node: HTMLElement | null = img;
      while (node && node !== container) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }

      setImageCenter(top + img.offsetHeight / 2);
    };

    updateImageCenter();

    const resizeObserver = new ResizeObserver(updateImageCenter);
    const img = sliderRef.current?.querySelector('img');
    if (img) resizeObserver.observe(img);
    window.addEventListener('resize', updateImageCenter);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateImageCenter);
    };
  }, [filteredProducts, pageSize]);

  // Don't render anything — this data comes from context so no layout shift risk
  // (context is hydrated before paint, so filteredProducts.length is known immediately)
  if (filteredProducts.length === 0) {
    return null;
  }

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const canGoPrev = page > 0;
  const canGoNext = page < pageCount - 1;

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-2xl font-bold text-white mb-3 md:mb-4">
            {t('recently_viewed_title')}
          </h2>
        </div>

        <div ref={sliderRef} className="relative group/slider">
          {pageCount > 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              disabled={!canGoPrev}
              aria-label="Previous products"
              style={imageCenter != null ? { top: `${imageCenter}px` } : undefined}
              className={`product_image_skip border-2 left-2 ${imageCenter == null ? 'top-1/2' : ''} z-10 opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100 transition-opacity duration-300 ${canGoPrev
                  ? '!bg-primary border-greny hover:!bg-greny cursor-pointer'
                  : '!bg-gray-300 border-gray-300 cursor-not-allowed'
                }`}
            >
              <ChevronLeft className={canGoPrev ? 'text-white' : 'text-gray-400'} />
            </button>
          )}

          {/* Sliding viewport — clips the track, which holds every page side by side */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${pageCount * 100}%`,
                transform: `translateX(-${(100 / pageCount) * page}%)`,
              }}
            >
              {Array.from({ length: pageCount }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="shrink-0 gap-4 sm:gap-5 md:gap-7 grid grid-cols-2 lg:grid-cols-3"
                  style={{ width: `${100 / pageCount}%` }}
                >
                  {filteredProducts
                    .slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              ))}
            </div>
          </div>

          {pageCount > 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canGoNext}
              aria-label="Next products"
              style={imageCenter != null ? { top: `${imageCenter}px` } : undefined}
              className={`product_image_skip border-2 right-2 ${imageCenter == null ? 'top-1/2' : ''} z-10 opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100 transition-opacity duration-300 ${canGoNext
                  ? '!bg-primary border-greny hover:!bg-greny cursor-pointer'
                  : '!bg-gray-300 border-gray-300 cursor-not-allowed'
                }`}
            >
              <ChevronRight className={canGoNext ? 'text-white' : 'text-gray-400'} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
