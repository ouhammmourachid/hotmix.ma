"use client";
import { Grid, FilterButton, FilterSummary } from '@/components/small-pieces';
import { useFilter } from '@/contexts/filter-context';
import RenderProducts from '@/components/product/render-products';
import { useState, useEffect, useRef } from 'react';
import { useApiService } from '@/services/api.service';
import Product from '@/types/product';

import { useTranslation } from '@/lib/i18n-utils';

export default function Page() {
  const { filterState, setIsFilterOpen, toString, setFilterStateWithUrl } = useFilter();
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const api = useApiService();

  const { t } = useTranslation();


  const fetchData = async (filter: string, currentPage: number) => {
    try {
      const response = await api.product.getAll(`${filter}&page=${page}`);

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

  useEffect(() => {
    // populate the filter state with data from the url
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    setFilterStateWithUrl(searchParams);
  }, []);

  // change the filter state when the url changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    setFilterStateWithUrl(urlParams);
  }, []);

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
