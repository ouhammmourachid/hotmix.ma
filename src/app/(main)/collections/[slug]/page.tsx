"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Grid, FilterSummary, FilterButton } from '@/components/small-pieces';
import { useFilter } from '@/contexts/filter-context';
import RenderProducts from '@/components/product/render-products';
import { useApiService } from '@/services/api.service';
import Product from '@/types/product';
import Category from '@/types/category';
import { useTranslation } from '@/lib/i18n-utils';

export default function CollectionPage() {
    const { slug } = useParams();
    const { filterState, setIsFilterOpen, toString, setFilterState, setFilterStateWithUrl } = useFilter();
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastRequestId = useRef(0);
    const api = useApiService();

    // Fetch category first
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                if (!slug) return;

                // Fetch all categories to find the match
                // Ideally we should have an API to fetch by slug or name
                const response = await api.category.getAll();
                const categories = response.data;

                // Find category matching the slug (assuming slug is name-like)
                // Adjust logic if slug is different (e.g. kebab-case vs Name)
                const match = categories.find((c: Category) =>
                    c.name.toLowerCase() === (slug as string).toLowerCase().replace(/-/g, ' ') ||
                    c.name.toLowerCase().replace(/\s+/g, '-') === (slug as string).toLowerCase()
                );

                if (match) {
                    setCurrentCategory(match);
                    // Update filter state to include this category
                    setFilterState((prev: any) => ({ ...prev, category: match.id }));
                } else {
                    console.error("Category not found");
                    // Handle 404 behavior if needed
                }
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [slug]);

    // Fetch products
    const fetchData = async (filter: string, currentPage: number) => {
        if (!currentCategory) return;

        const requestId = ++lastRequestId.current;
        try {
            // Ensure specific category is in filter if not already (though `filterState` should have it)
            // We rely on `toString()` effectively.

            const response = await api.product.getAll(filter + `&page=${currentPage}`);

            if (requestId !== lastRequestId.current) return;

            setProducts(prev =>
                currentPage === 1
                    ? response.data.results
                    : [...prev, ...response.data.results]
            );

            setCount(response.data.count);
            setHasMore(!!response.data.next);
        } catch (error) {
            if (requestId !== lastRequestId.current) return;
            console.error("Fetch error:", error);
            setHasMore(false);
        }
    };

    // When filter changes (or category is set), fetch data
    useEffect(() => {
        if (!currentCategory) return;

        setProducts([]);
        setPage(1);
        setHasMore(true);
        fetchData(toString(), 1);
    }, [filterState, currentCategory]);

    // Infinite scroll
    useEffect(() => {
        if (hasMore && page > 1 && currentCategory) {
            fetchData(toString(), page);
        }
    }, [page]);

    const lastProductRef = (node: HTMLDivElement | null) => {
        if (!node || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 0.1 }
        );
        observer.current.observe(node);
    };

    if (!currentCategory && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl">Category not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen sm:p-8 p-2">
            {/* Header */}
            <div className="flex flex-col justify-between items-center mb-8">
                <h1 className="text-4xl font-semibold capitalize">
                    {currentCategory?.name || (slug as string).replace(/-/g, ' ')}
                </h1>
                <div className="flex justify-between items-center mt-16 w-full">
                    <FilterButton onClick={() => setIsFilterOpen(true)} />
                    <Grid />
                </div>
            </div>

            <FilterSummary
                base={`/collections/${slug}`}
                count={count}
            />

            <RenderProducts
                ref={lastProductRef}
                products={products}
            />

            {!hasMore && products.length > 0 && (
                <div className="text-center mt-4 text-gray-500">
                    No more products to load
                </div>
            )}
        </div>
    );
}
