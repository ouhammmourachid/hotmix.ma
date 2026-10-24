"use client";

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ImageType from '@/types/image';
import ZoomableImage from '@/components/product/zoomable-image';

interface ProductImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageType[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function ProductImageLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}: ProductImageLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  // Slide the track is showing, so a scroll we started ourselves doesn't report back as a swipe
  const visibleIndexRef = useRef(currentIndex);
  const scrollSettleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior) => {
    const track = trackRef.current;
    if (!track) return;
    // In RTL the track scrolls towards negative scrollLeft
    const direction = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
    track.scrollTo({ left: direction * index * track.clientWidth, behavior });
  }, []);

  // Open directly on the image that was tapped, without animating through the others
  useLayoutEffect(() => {
    if (!isOpen) return;
    setIsZoomed(false);
    visibleIndexRef.current = currentIndex;
    scrollToIndex(currentIndex, 'instant');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Follow index changes made by the arrows or keyboard
  useEffect(() => {
    if (!isOpen || visibleIndexRef.current === currentIndex) return;
    visibleIndexRef.current = currentIndex;
    scrollToIndex(currentIndex, 'smooth');
  }, [currentIndex, isOpen, scrollToIndex]);

  useEffect(() => () => clearTimeout(scrollSettleTimer.current), []);

  // Report a swipe only once the snap has settled, so a smooth scroll across several slides
  // doesn't emit the intermediate indexes
  const handleScroll = () => {
    clearTimeout(scrollSettleTimer.current);
    scrollSettleTimer.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const index = Math.round(Math.abs(track.scrollLeft) / track.clientWidth);
      if (index !== visibleIndexRef.current && index < images.length) {
        visibleIndexRef.current = index;
        onIndexChange(index);
      }
    }, 100);
  };

  const handleZoomChange = useCallback((zoomed: boolean) => {
    setIsZoomed(zoomed);
    // A pinch can start while the swipe is mid-way; settle on the current image before locking the track
    if (zoomed) scrollToIndex(visibleIndexRef.current, 'instant');
  }, [scrollToIndex]);

  const paginate = useCallback(
    (step: number) => {
      const nextIndex = Math.min(Math.max(currentIndex + step, 0), images.length - 1);
      if (nextIndex !== currentIndex) onIndexChange(nextIndex);
    },
    [currentIndex, images.length, onIndexChange]
  );

  // Keyboard navigation & focus trap
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        // In RTL the next image sits to the left
        const isRtl = document.documentElement.dir === 'rtl';
        paginate((e.key === 'ArrowRight') !== isRtl ? 1 : -1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose, paginate]);

  if (!isOpen || !images || images.length === 0) return null;

  const arrowClassName = "hidden md:flex absolute top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/50 hover:bg-white hover:text-black text-white backdrop-blur-md transition-all duration-200 focus:outline-none shadow-2xl items-center justify-center disabled:opacity-0 disabled:pointer-events-none";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image Gallery"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col justify-between select-none text-white font-sans"
        >
          {/* Header Bar Overlay */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-6 pb-4 z-50 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
            {/* Counter */}
            <div dir="ltr" className="text-sm md:text-base font-medium text-white/90 tracking-widest pl-2 pointer-events-auto tabular-nums">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Controls: Close Button Only */}
            <div className="flex items-center gap-4 md:gap-6 pr-2 pointer-events-auto">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all focus:outline-none"
                title="Close Gallery"
                aria-label="Close Gallery"
              >
                <X className="w-6 h-6" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Swipe track: native scroll-snap, locked while an image is zoomed so pans don't change image */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            style={{ overflowX: isZoomed ? 'hidden' : undefined }}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none]"
          >
            {images.map((img, index) => (
              <div key={index} className="relative h-full w-full shrink-0 snap-start snap-always">
                <ZoomableImage
                  src={img.path}
                  alt={`Product view ${index + 1}`}
                  active={index === currentIndex}
                  eager={Math.abs(index - currentIndex) <= 1}
                  onZoomChange={handleZoomChange}
                />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => paginate(-1)}
                disabled={currentIndex === 0}
                className={`${arrowClassName} start-3 md:start-8`}
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 rtl:-scale-x-100" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                disabled={currentIndex === images.length - 1}
                className={`${arrowClassName} end-3 md:end-8`}
                aria-label="Next Image"
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 rtl:-scale-x-100" strokeWidth={2} />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
