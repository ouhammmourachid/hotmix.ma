"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApiService } from "@/services/api.service";
import Category from "@/types/category";
import Product from "@/types/product";
import { useTranslation } from "@/lib/i18n-utils";
import { createCategorySlug } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryWithImage extends Category {
  imageUrl?: string;
  slug: string;
}

export default function CategoryCollection() {
  const { t } = useTranslation();
  const [categoriesWithImages, setCategoriesWithImages] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const api = useApiService();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        // 1. Fetch categories
        const catRes = await api.category.getAll();
        const categoriesData: Category[] = catRes.data || [];

        if (categoriesData.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Fetch published products to find first matching product per category
        const prodRes = await api.product.getAll("page=1&perPage=100");
        const productsData: Product[] = prodRes.data?.results || [];

        // 3. Map categories to their first product's image
        const items: CategoryWithImage[] = categoriesData.map((cat) => {
          const slug = createCategorySlug(cat.name);

          // Find first product belonging to this category
          const matchingProduct = productsData.find((p) => {
            if (!p.images || p.images.length === 0) return false;
            const pCat = p.category as any;
            if (!pCat) return false;
            if (typeof pCat === "string") return pCat === cat.id;
            if (Array.isArray(pCat)) {
              return pCat.some(
                (c: any) =>
                  c.id === cat.id ||
                  c.name?.toLowerCase() === cat.name.toLowerCase()
              );
            }
            return (
              pCat.id === cat.id ||
              pCat.name?.toLowerCase() === cat.name.toLowerCase()
            );
          });

          // Fallback image if category has no product yet in the pool
          const firstProductImage = matchingProduct?.images[0]?.path;
          const fallbackImage =
            productsData.find((p) => p.images && p.images.length > 0)?.images[0]?.path ||
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop";

          return {
            ...cat,
            slug,
            imageUrl: firstProductImage || fallbackImage,
          };
        });

        setCategoriesWithImages(items);
      } catch (error) {
        console.error("Failed to load category collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!loading && categoriesWithImages.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            {t("our_collections_title")}
          </h2>
          <p className="font-outfit text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t("our_collections_subtitle")}
          </p>
        </motion.div>

        {/* Scrollable Single Row Container */}
        <div className="relative group/scroll">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 p-2.5 sm:p-3 rounded-full border border-gray-300 dark:border-gray-700 bg-background/90 backdrop-blur-sm hover:bg-secondary hover:text-white transition-all duration-200 shadow-md opacity-0 group-hover/scroll:opacity-100 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-10 p-2.5 sm:p-3 rounded-full border border-gray-300 dark:border-gray-700 bg-background/90 backdrop-blur-sm hover:bg-secondary hover:text-white transition-all duration-200 shadow-md opacity-0 group-hover/scroll:opacity-100 focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>

          <div
            ref={scrollRef}
            className="flex flex-nowrap overflow-x-auto gap-2 sm:gap-4 md:gap-6 pb-6 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-[calc((100%-1.25rem)/3.2)] sm:w-[calc((100%-2rem)/4)] md:w-[260px] lg:w-[300px] flex-shrink-0 snap-start aspect-[3/4.2] rounded-sm bg-gray-200 dark:bg-gray-800 animate-pulse"
                  />
                ))
              : categoriesWithImages.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="w-[calc((100%-1.25rem)/3.2)] sm:w-[calc((100%-2rem)/4)] md:w-[260px] lg:w-[300px] flex-shrink-0 snap-start"
                  >
                    <Link
                      href={`/collections/${category.slug}`}
                      className="group relative block aspect-[3/4.2] w-full overflow-hidden rounded-sm bg-secondary shadow-sm transition-all duration-300 hover:shadow-xl"
                    >
                      {/* Category Image */}
                      {category.imageUrl && (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/45" />

                      {/* Text Label */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4 md:p-6 flex items-end">
                        <h3 className="text-white font-outfit font-bold text-[11px] sm:text-sm md:text-lg tracking-tight sm:tracking-wider leading-tight text-left rtl:text-right group-hover:text-greny transition-colors duration-300 drop-shadow-md">
                          {category.name}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
