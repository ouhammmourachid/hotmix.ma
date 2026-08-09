"use client";
import { useState, useEffect } from 'react';
import HorizontalProductCard from '@/components/product/card/horizontal-product-card';
import ProductCard from '@/components/product/card/product-card';
import Product from '@/types/product';
import { useGrid } from '@/contexts/grid-context';

function HorizontalProductCardSkeleton() {
  return (
    <div className="p-4 sm:p-6 h-fit border-b-2 border-secondary animate-pulse w-full">
      <div className="flex flex-row gap-2 md:gap-6">
        <div className="w-1/3 lg:w-1/4 rounded-lg bg-gray-700 overflow-hidden" style={{ aspectRatio: '1000/1500' }} />
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-3">
            <div className="h-6 bg-gray-700 rounded w-3/4" />
            <div className="h-5 bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-700 rounded w-full hidden md:block" />
            <div className="h-4 bg-gray-700 rounded w-2/3 hidden md:block" />
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-8 w-8 bg-gray-700 rounded" />
            <div className="h-8 w-8 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="w-full rounded-lg bg-gray-700" style={{ aspectRatio: '1000/1500' }} />
      <div className="h-4 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-1/3" />
      <div className="h-10 bg-gray-700 rounded w-full mt-2" />
    </div>
  );
}

export default function RenderProducts({
  products,
  ref,
  loading = false
}: {
  products: Product[],
  ref?: any,
  loading?: boolean
}) {
  const { gridSize } = useGrid();
  const [responsiveGridSize, setResponsiveGridSize] = useState(1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Update responsive grid size on initial render and window resize
  useEffect(() => {
    const updateLayout = () => {
      // Check if we're on a small screen
      const smallScreen = typeof window !== 'undefined' && window.innerWidth <= 640;
      setIsSmallScreen(smallScreen);

      // For small screens, always use 1 column, but remember grid selection
      setResponsiveGridSize(smallScreen ? 1 : gridSize);
    };

    // Set initial values
    updateLayout();

    // Update on window resize
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [gridSize]);

  // On small screens, use HorizontalProductCard for gridSize=1, otherwise use ProductCard
  // On larger screens, use the normal logic based on the actual grid size
  const useHorizontalCard = isSmallScreen ? gridSize === 1 : responsiveGridSize === 1;

  // Show grid-aware skeleton placeholders while loading or when products array is empty during initial load
  if (loading) {
    return (
      <div
        style={{ gridTemplateColumns: `repeat(${responsiveGridSize}, 1fr)` }}
        className="gap-8 items-center justify-center grid w-full"
      >
        {Array.from({ length: 6 }).map((_, index) =>
          useHorizontalCard ? (
            <HorizontalProductCardSkeleton key={index} />
          ) : (
            <ProductCardSkeleton key={index} />
          )
        )}
      </div>
    );
  }

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${responsiveGridSize}, 1fr)` }}
      className="gap-8 items-center justify-center grid w-full">
      {
        products && products.map((product: Product, index: number) => {
          return useHorizontalCard ? (
            <HorizontalProductCard
              ref={index === products.length - 1 ? ref : null}
              product={product}
              key={product.id} />
          ) : (
            <ProductCard
              ref={index === products.length - 1 ? ref : null}
              product={product}
              key={index}
              delay={0.4 * (index + 1)}
            />
          );
        })
      }
    </div>
  );
}
