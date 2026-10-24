"use client";
import ProductCard from "@/components/product/card/product-card";
import Product from "@/types/product";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Card widths leave room for the track's gap so exactly 2 cards (3 from lg = 1024px) fill the view
const CARD_WIDTH_CLASSES =
  'w-[calc((100%_-_1rem)/2)] sm:w-[calc((100%_-_1.25rem)/2)] md:w-[calc((100%_-_1.75rem)/2)] lg:w-[calc((100%_-_3.5rem)/3)]';

// Horizontal product row with native swipe (scroll-snap) on touch and arrows on desktop
export default function ProductSlider({ products, resetKey }: {
  products: Product[];
  // Scroll back to the first card when this changes, e.g. on navigating to another product
  resetKey?: string;
}) {
  const [imageCenter, setImageCenter] = useState<number | null>(null);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Arrows enable/disable from the real scroll position, so they stay right after a swipe
  const updateArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    // In RTL scrollLeft runs from 0 towards negative values
    const position = Math.abs(track.scrollLeft);
    const max = track.scrollWidth - track.clientWidth;
    setCanGoPrev(position > 2);
    setCanGoNext(position < max - 2);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const resizeObserver = new ResizeObserver(updateArrows);
    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    updateArrows();
  }, [resetKey, products.length]);

  // Arrows should sit at the vertical center of the product image only, not the
  // whole card (image + name + price) — that image height varies per breakpoint,
  // so measure the rendered image instead of guessing a fixed percentage.
  useEffect(() => {
    if (products.length === 0) return;

    const updateImageCenter = () => {
      const container = sliderRef.current;
      const img = container?.querySelector('img');
      if (!container || !img) return;

      // ProductCard plays a translateY entrance animation on mount, which
      // getBoundingClientRect() would pick up mid-transition and bake into the
      // arrow position permanently. offsetTop is a layout value — it ignores
      // CSS transforms — so it stays correct regardless of the animation.
      let top = 0;
      let node: HTMLElement | null = img;
      while (node && node !== container) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }

      setImageCenter(top + img.offsetHeight / 2);
    };

    updateImageCenter();

    const resizeObserver = new ResizeObserver(updateImageCenter);
    const img = sliderRef.current?.querySelector('img');
    if (img) resizeObserver.observe(img);
    window.addEventListener('resize', updateImageCenter);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateImageCenter);
    };
  }, [products]);

  // Move by one view; scroll-snap then lines the first visible card up with the edge
  const scrollPage = (step: number) => {
    const track = trackRef.current;
    if (!track) return;
    const direction = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
    track.scrollBy({ left: step * direction * track.clientWidth, behavior: 'smooth' });
  };

  const hasOverflow = canGoPrev || canGoNext;
  const arrowClassName = (enabled: boolean) =>
    `product_image_skip border-2 ${imageCenter == null ? 'top-1/2' : ''} z-10 opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100 transition-opacity duration-300 ${enabled
      ? '!bg-primary border-greny hover:!bg-greny cursor-pointer'
      : '!bg-gray-300 border-gray-300 cursor-not-allowed'
    }`;

  return (
    <div ref={sliderRef} className="relative group/slider">
      {hasOverflow && (
        <button
          type="button"
          onClick={() => scrollPage(-1)}
          disabled={!canGoPrev}
          aria-label="Previous products"
          style={imageCenter != null ? { top: `${imageCenter}px` } : undefined}
          className={`${arrowClassName(canGoPrev)} start-2`}
        >
          <ChevronLeft className={`rtl:-scale-x-100 ${canGoPrev ? 'text-white' : 'text-gray-400'}`} />
        </button>
      )}

      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-4 sm:gap-5 md:gap-7 overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        {products.map((product) => (
          <div key={product.id} className={`shrink-0 snap-start ${CARD_WIDTH_CLASSES}`}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {hasOverflow && (
        <button
          type="button"
          onClick={() => scrollPage(1)}
          disabled={!canGoNext}
          aria-label="Next products"
          style={imageCenter != null ? { top: `${imageCenter}px` } : undefined}
          className={`${arrowClassName(canGoNext)} end-2`}
        >
          <ChevronRight className={`rtl:-scale-x-100 ${canGoNext ? 'text-white' : 'text-gray-400'}`} />
        </button>
      )}
    </div>
  );
}
