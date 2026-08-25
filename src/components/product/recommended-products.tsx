"use client";
import ProductCard from "@/components/product/card/product-card";
import { useState, useEffect, useRef } from "react";
import { useApiService } from "@/services/api.service";
import Product from "@/types/product";
import { useTranslation } from '@/lib/i18n-utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MAX_PRODUCTS = 6;
// Matches the grid's `grid-cols-2 lg:grid-cols-3` breakpoint (Tailwind's default lg = 1024px),
// so each page always fills its rows exactly — no lone card wrapping onto its own row.
const DESKTOP_PAGE_SIZE = 3;
const MOBILE_PAGE_SIZE = 2;
const LG_BREAKPOINT_QUERY = '(min-width: 1024px)';

interface RecommendedProductsProps {
  currentProductId?: string;
}

export default function RecommendedProducts({ currentProductId }: RecommendedProductsProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(MOBILE_PAGE_SIZE);
  const [imageCenter, setImageCenter] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const api = useApiService();

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

  // Arrows should sit at the vertical center of the product image only, not the
  // whole card (image + name + price) — that image height varies per breakpoint,
  // so measure the rendered image instead of guessing a fixed percentage.
  useEffect(() => {
    if (loading || products.length === 0) return;

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
  }, [loading, products, pageSize]);

  useEffect(() => {
    if (!currentProductId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setPage(0);

    const fetchRecommendedProducts = async () => {
      try {
        const { data } = await api.product.getRecommended(currentProductId);
        const recommendedIds: string[] = (data.recommendations || []).map((r: { id: string }) => String(r.id));

        if (recommendedIds.length === 0) {
          if (!cancelled) setProducts([]);
          return;
        }

        const { data: hydrated } = await api.product.getByIds(recommendedIds);
        // getByIds doesn't guarantee order, so re-sort to match the API's relevance ranking
        const byId = new Map(hydrated.map((product: Product) => [String(product.id), product]));
        const ordered = recommendedIds
          .map((id) => byId.get(id))
          .filter((product): product is Product => Boolean(product))
          .slice(0, MAX_PRODUCTS);

        if (!cancelled) setProducts(ordered);
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

  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const canGoPrev = page > 0;
  const canGoNext = page < pageCount - 1;

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{t('recommended_products_title')}</h2>
        </div>

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
                    {products
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
        )}
      </div>
    </section>
  );
}
