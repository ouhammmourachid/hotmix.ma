"use client";
import ProductCard from "@/components/product/card/product-card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useApiService } from "@/services/api.service";
import Product from "@/types/product";
import { useTranslation } from '@/lib/i18n-utils';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";


import styles from '@/styles/main.module.css';

export default function NewCollection() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const api = useApiService();

  const fetchData = async () => {
    try {
      const response = await api.product.getAll('page=1&perPage=20');
      setProducts(response.data.results);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="md:py-8">
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
        <div className="gap-7 items-center justify-center grid lg:grid-cols-4 grid-cols-2">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={0.4 * (index + 1)} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/products">
            <Button className={styles.hero_section_button}>
              {t('view_all')} <ArrowUpRight className="w-6 h-6 ml-2 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
