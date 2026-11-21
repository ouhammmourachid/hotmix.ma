"use client";
import ProductCard from "@/components/product/card/product-card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useApiService } from "@/services/api.service";
import Product from "@/types/product";
import { useTranslation } from '@/lib/i18n-utils';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
    <section className="pt-8 pb-20 md:pt-12 md:pb-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 md:mb-14">
          <h2 className="text-title-1 md:text-large-title font-semibold text-label">{t('new_collection_title')}</h2>
          <p className="mt-2 md:mt-3 text-body md:text-title-3 md:font-normal text-label-2 max-w-xl mx-auto">{t('new_collection_subtitle')}</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-x-3 gap-y-10 sm:gap-x-5 lg:gap-x-6 lg:gap-y-14">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={0.05 * (index % 4)} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button asChild variant="tinted" className="h-12 px-7 text-body font-medium">
            <Link href="/products">
              {t('view_all')} <ChevronRight className="!w-5 !h-5 -me-1 rtl:rotate-180" strokeWidth={2.25} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
