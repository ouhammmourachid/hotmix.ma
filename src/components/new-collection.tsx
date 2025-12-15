"use client";
import ProductCard from "@/components/product/card/product-card";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useApiService } from "@/services/api.service";
import Product from "@/types/product";
import { useTranslation } from '@/lib/i18n-utils';


export default function NewCollection() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const api = useApiService();

  const fetchData = async () => {
    try {
      const response = await api.product.getAll('page=1&perPage=10');
      setProducts(response.data.results);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={0.4 * (index + 1)} />
          ))}
        </div>
      </div>
    </section>
  );
};
