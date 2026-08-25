"use client";
import { Grid, FilterButton, FilterSummary } from '@/components/small-pieces';
import { useFilter } from '@/contexts/filter-context';
import RenderProducts from '@/components/product/render-products';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApiService } from '@/services/api.service';
import Product from '@/types/product';

import { useTranslation } from '@/lib/i18n-utils';

export default function SearchPageClient() {
  const { filterState, setIsFilterOpen, toString, setFilterStateWithUrl } = useFilter();
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const api = useApiService();
  const latestFilterRef = useRef<string>('');
  const searchParams = useSearchParams();

  const { t } = useTranslation();


  const fetchData = async (filter: string, currentPage: number) => {
    latestFilterRef.current = filter;
    try {
      const response = await api.product.getAll(`${filter}&page=${currentPage}`);

      // A slower, older request (e.g. the initial unfiltered fetch before the
      // URL query populates filterState) can resolve after a newer one —
      // only apply it if it's still answering the latest filter.
      if (latestFilterRef.current !== filter) return;

      // If it's the first page, replace products, otherwise append
      setProducts(prev =>
        currentPage === 1
          ? response.data.results
          : [...prev, ...response.data.results]
      );

      setCount(response.data.count);
      setHasMore(!!response.data.next);

      console.log("Fetch details:", {
        page: currentPage,
        resultsCount: response.data.results.length,
        hasMore: !!response.data.next
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setHasMore(false);
    }
  };

  const searchParamsString = searchParams.toString();

  useEffect(() => {
    // Re-sync filterState whenever the URL query changes — including
    // client-side navigations (e.g. the "View all" link from the search
    // modal) that don't remount this page, so a mount-only effect would miss.
    // Keyed on the string form because useSearchParams() doesn't return a
    // referentially stable object across renders.
    setFilterStateWithUrl(searchParams);
  }, [searchParamsString]);

  // Reset when filter changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchData(toString(), 1); // Immediately fetch first page
  }, [filterState]);

  // Fetch more products when page changes (and hasMore is true)
  useEffect(() => {
    if (hasMore && page > 1) {
      fetchData(toString(), page);
    }
  }, [page]);

  const lastProductRef = (node: HTMLDivElement | null) => {
    if (!node || !hasMore) return;

    // Disconnect previous observer
    if (observer.current) observer.current.disconnect();

    // Create new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    observer.current.observe(node);
  };
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex flex-col justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold">{count} {t('search_results_for')} "{filterState.searchQuery}"</h1>
        <div className="flex justify-between items-center mt-16 w-full">
          <FilterButton onClick={() => setIsFilterOpen(true)} />
          <Grid />
        </div>
      </div>
      {/* Filter Summary */}
      <FilterSummary
        count={count}
        base='/search' />
      {/* Products */}
      <RenderProducts
        ref={lastProductRef}
        products={products} />

      {/* Optional: No more products indicator */}
      {!hasMore && products.length > 0 && (
        <div className="text-center mt-4 text-gray-500">
          {t('search_no_more_products')}
        </div>
      )}

    </div>
  );
}
