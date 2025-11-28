"use client";
import ProductCard from "@/components/product/card/product-card";
import {motion} from "framer-motion";
import {useState, useEffect, useRef} from "react";
import { useApiService } from "@/services/api.service";
import Product from "@/types/product";
import { useTranslation } from '@/lib/i18n-utils';


export default function NewCollection(){
        const { t } = useTranslation();
        const [products, setProducts] = useState<Product[]>([]);
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);
        const observer = useRef<IntersectionObserver | null>(null);
        const api = useApiService();

        const fetchData = async (currentPage: number) => {
          try {
            const response = await api.product.getAll(`page=${currentPage}`);

            // If it's the first page, replace products, otherwise append
            setProducts(prev =>
              currentPage === 1
                ? response.data.results
                : [...prev, ...response.data.results]
            );
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
          setProducts([]);
          setPage(1);
          setHasMore(true);
          fetchData(1); // Immediately fetch first page
        }, []);

        // Fetch more products when page changes (and hasMore is true)
        useEffect(() => {
          if (hasMore && page > 1) {
            fetchData(page);
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
            { threshold: 0.01 } // Trigger when 10% of the element is visible
          );

          observer.current.observe(node);
        };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('new_collection_title')}</h2>
          <p className="text-xl">{t('new_collection_subtitle')}</p>
        </motion.div>
        <div className="gap-7 items-center justify-center grid lg:grid-cols-3 grid-cols-2">
          {products.map((product,index) => (
            <ProductCard
                key={product.id}
                product={product}
                ref = {products.length === index + 1 ? lastProductRef : null}
                delay={0.4*(index+1)} />
          ))}
        </div>
      </div>
    </section>
  );
};
