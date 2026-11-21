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

          // Tile image: the LAST image of the category's first product
          const lastImagePath = (p?: Product) => p?.images?.[p.images.length - 1]?.path;
          const firstProductImage = lastImagePath(matchingProduct);
          // Fallback image if category has no product yet in the pool
          const fallbackImage =
            lastImagePath(productsData.find((p) => p.images && p.images.length > 0)) ||
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
    <section className="pt-14 pb-4 md:pt-24 md:pb-8 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-title-1 md:text-large-title font-semibold text-label">
            {t("our_collections_title")}
          </h2>
          <p className="mt-2 md:mt-3 text-body md:text-title-3 text-label-2 max-w-xl mx-auto">
            {t("our_collections_subtitle")}
          </p>
        </motion.div>

        {/* Scrollable Single Row Container */}
        <div className="relative group/scroll">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 w-11 h-11 items-center justify-center rounded-full material-thin text-label hover:bg-primary/70 shadow-float transition-[opacity,background-color] duration-200 opacity-0 group-hover/scroll:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-10 w-11 h-11 items-center justify-center rounded-full material-thin text-label hover:bg-primary/70 shadow-float transition-[opacity,background-color] duration-200 opacity-0 group-hover/scroll:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>

          <div
            ref={scrollRef}
            className="flex flex-nowrap overflow-x-auto gap-3 sm:gap-4 md:gap-6 -mx-4 px-4 scroll-px-4 md:mx-0 md:px-0 md:scroll-px-0 pb-6 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-[calc((100%-0.75rem)/2.3)] sm:w-[calc((100%-2rem)/3.4)] md:w-[260px] lg:w-[300px] flex-shrink-0 snap-start aspect-[3/4.2] rounded-card bg-fill animate-pulse"
                  />
                ))
              : categoriesWithImages.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[calc((100%-0.75rem)/2.3)] sm:w-[calc((100%-2rem)/3.4)] md:w-[260px] lg:w-[300px] flex-shrink-0 snap-start"
                  >
                    <Link
                      href={`/collections/${category.slug}`}
                      className="group relative block aspect-[3/4.2] w-full overflow-hidden rounded-card bg-surface transition-transform duration-300 ease-apple active:scale-[0.98] [transform:translateZ(0)]"
                    >
                      {/* Category Image */}
                      {category.imageUrl && (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-full w-full object-cover object-top transition-transform duration-700 ease-apple group-hover:scale-[1.03]"
                        />
                      )}

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                      {/* Text Label */}
                      <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 md:p-5 flex items-end">
                        <h3 className="text-white font-semibold text-subhead md:text-title-3 text-start [text-shadow:0_1px_8px_rgb(0_0_0/0.35)]">
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
