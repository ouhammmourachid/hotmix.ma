"use client";
import { useState, useEffect } from 'react';
import HorizontalProductCard from '@/components/product/card/horizontal-product-card';
import ProductCard from '@/components/product/card/product-card';
import Product from '@/types/product';
import { useGrid } from '@/contexts/grid-context';


export default function RenderProducts({
                                        products,
                                        ref
                                      }: {
                                        products: Product[],
                                        ref: any
                                      }){
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
  
  return (
    <div
      style={{gridTemplateColumns: `repeat(${responsiveGridSize}, 1fr)`}}
      className="gap-8 items-center justify-center grid w-full">
      {
        products && products.map((product: Product, index: number) => {
          // On small screens, use HorizontalProductCard for gridSize=1, otherwise use ProductCard
          // On larger screens, use the normal logic based on the actual grid size
          const useHorizontalCard = isSmallScreen ? gridSize === 1 : responsiveGridSize === 1;
          
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
                grid={responsiveGridSize}
                delay={0.4*(index+1)}
                />
          );
        })
      }
    </div>
  )
}
