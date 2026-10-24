"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Product from "@/types/product";
import { useApiService } from "@/services/api.service";

interface RecentlyViewedContextType {
    recentlyViewed: Product[];
    addToRecentlyViewed: (product: Product) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const STORAGE_KEY = "recently_viewed_ids";

function readStoredIds(): string[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        const parsed = JSON.parse(stored);
        // Basic validation to ensure it's an array of strings
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("Failed to parse recently viewed products", e);
        return [];
    }
}

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
    const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
    const api = useApiService();

    // Load IDs from local storage (client-side only)
    useEffect(() => {
        const storedIds = readStoredIds();
        if (storedIds.length > 0) setRecentlyViewedIds(storedIds);
    }, []);

    // Fetch products when IDs change
    useEffect(() => {
        if (recentlyViewedIds.length === 0) {
            setRecentlyViewed([]);
            return;
        }

        const fetchProducts = async () => {
            try {
                const { data } = await api.product.getByIds(recentlyViewedIds);

                // Sort the fetched products to match the order of recentlyViewedIds (most recent first)
                const sorted = recentlyViewedIds
                    .map(id => data.find((p: Product) => p.id === id))
                    .filter((p): p is Product => p !== undefined);

                setRecentlyViewed(sorted);
            } catch (error) {
                console.error("Failed to fetch recently viewed products", error);
            }
        };

        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recentlyViewedIds]);

    const addToRecentlyViewed = useCallback((product: Product) => {
        setRecentlyViewedIds((prev) => {
            // A product page adds itself in its own mount effect, which runs before the load effect
            // above (child effects run first), so fall back to storage instead of overwriting it
            const current = prev.length > 0 ? prev : readStoredIds();
            // Remove current product id if it exists
            const filtered = current.filter((id) => id !== product.id);
            // Add to front and limit to 10
            const updated = [product.id, ...filtered].slice(0, 10);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    return (
        <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext);
    if (context === undefined) {
        throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
    }
    return context;
}
