"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Product from "@/types/product";

interface RecentlyViewedContextType {
    recentlyViewed: Product[];
    addToRecentlyViewed: (product: Product) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("recently_viewed");
        if (stored) {
            try {
                setRecentlyViewed(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recently viewed products", e);
            }
        }
    }, []);

    const addToRecentlyViewed = useCallback((product: Product) => {
        setRecentlyViewed((prev) => {
            // Remove current product if it exists to avoid duplicates and move it to the front
            const filtered = prev.filter((p) => p.id !== product.id);
            // Add to front and limit to 3
            const updated = [product, ...filtered].slice(0, 3);

            localStorage.setItem("recently_viewed", JSON.stringify(updated));
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
