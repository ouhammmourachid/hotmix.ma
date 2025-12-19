"use client";
import { Grid, FilterButton, FilterSummary } from '@/components/small-pieces';
import { useFilter } from '@/contexts/filter-context';
import RenderProducts from '@/components/product/render-products';
import { useState, useEffect, useRef } from 'react';
import { useApiService } from '@/services/api.service';
import { useTranslation } from '@/lib/i18n-utils';
import Product from '@/types/product';
import styles from '@/styles/main.module.css';

export default function Page() {
  const { t } = useTranslation();
  const { filterState, setIsFilterOpen, toString, setFilterStateWithUrl } = useFilter();
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const api = useApiService();

  const fetchData = async (filter: string, currentPage: number) => {
    try {

      const response = await api.product.getAll('sale=true&' + filter + `&page=${page}`);

      // If it's the first page, replace products, otherwise append
      setProducts(prev =>
        currentPage === 1
          ? response.data.results
          : [...prev, ...response.data.results]
      );

      setCount(response.data.count);
      setHasMore(!!response.data.next);
    } catch (error) {
      console.error('Error fetching sale products:', error);
    }

  }

  useEffect(() => {
    // populate the filter state with data from the url
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    setFilterStateWithUrl(searchParams);
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
    <div className="min-h-screen sm:p-8 p-2">
      {/* Header */}
      <div className={styles.main_pages_header}>
        <h1 className={styles.main_pages_title}>{t('sale_page_title')}</h1>
        <div className={styles.main_pages_filter}>
          <FilterButton onClick={() => setIsFilterOpen(true)} />
          <Grid />
        </div>
      </div>
      {/* Filter Summary */}
      <FilterSummary
        count={count}
        base='/sale' />
      {/* Products */}
      <RenderProducts
        ref={lastProductRef}
        products={products} />

      {/* Optional: No more products indicator */}
      {!hasMore && products.length > 0 && (
        <div className={styles.main_pages_no_more_products}>
          {t('no_more_products')}
        </div>
      )}

    </div>
  );
}
