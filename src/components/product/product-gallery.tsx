"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageMagnifier from '@/components/image-magnifier';

// Main image is full width on mobile and ~half of the 1450px page on desktop
const MAIN_IMAGE_SIZES = '(min-width: 1450px) 700px, (min-width: 1024px) 50vw, 100vw';

export default function ProductGallery({ images, alt, currentIndex, onIndexChange, onOpenLightbox }: {
  images: { path: string }[];
  alt: string;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onOpenLightbox: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Slide the track is showing, so a scroll we started ourselves doesn't report back as a swipe
  const visibleIndexRef = useRef(0);
  const scrollSettleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Scroll to the selected image when it changes from outside the track (thumbnail, arrow, color, lightbox)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || visibleIndexRef.current === currentIndex) return;
    visibleIndexRef.current = currentIndex;
    // In RTL the track scrolls towards negative scrollLeft
    const direction = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
    track.scrollTo({ left: direction * currentIndex * track.clientWidth, behavior: 'smooth' });
  }, [currentIndex]);

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

  const hasMultipleImages = images.length > 1;

  return (
    <div className="flex gap-4 lg:w-[55%] ml-0 flex-col-reverse md:flex-row min-w-0">
      <div className="flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-visible p-0.5 [scrollbar-width:none] [-ms-overflow-style:none]">
        {images.map((img, index) => (
          <motion.button
            key={index}
            initial={{
              rotate: 60,
              scale: 0.9,
              opacity: 0
            }}
            animate={{
              rotate: 0,
              scale: 1,
              opacity: 1
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.05
            }}
            onClick={() => onIndexChange(index)}
            aria-label={`${alt} ${index + 1}`}
            className={`w-20 h-fit shrink-0 rounded-lg overflow-hidden ${currentIndex === index ? 'ring-2 ring-greny' : ''
              }`}
          >
            {/* Aspect-ratio container keeps thumbnail proportional and prevents CLS */}
            <div style={{ aspectRatio: '1000/1500' }} className="relative w-full overflow-hidden">
              <Image
                src={img.path}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="relative w-full min-w-0 group">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory overscroll-x-contain rounded-lg [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="w-full shrink-0 snap-start snap-always cursor-pointer"
              onClick={onOpenLightbox}
            >
              <ImageMagnifier
                src={img.path}
                alt={alt}
                sizes={MAIN_IMAGE_SIZES}
                preload={index === 0}
                // Neighbours load right away so a swipe or arrow tap shows the image immediately
                eager={Math.abs(index - currentIndex) <= 1}
              />
            </div>
          ))}
        </div>
        {hasMultipleImages && (
          <>
            <button
              onClick={() => onIndexChange(Math.max(currentIndex - 1, 0))}
              aria-label="Previous image"
              className="product_image_skip start-4 top-1/2 z-10 transition-opacity disabled:opacity-0 disabled:pointer-events-none"
              disabled={currentIndex === 0}>
              <ChevronLeft className="text-black rtl:-scale-x-100" />
            </button>
            <button
              onClick={() => onIndexChange(Math.min(currentIndex + 1, images.length - 1))}
              aria-label="Next image"
              className="product_image_skip end-4 top-1/2 z-10 transition-opacity disabled:opacity-0 disabled:pointer-events-none"
              disabled={currentIndex === images.length - 1}>
              <ChevronRight className="text-black rtl:-scale-x-100" />
            </button>
            {/* Tells mobile shoppers there are more photos to swipe through */}
            <span
              aria-live="polite"
              dir="ltr"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white tabular-nums pointer-events-none"
            >
              {currentIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
