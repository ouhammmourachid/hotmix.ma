"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ImageType from '@/types/image';

interface ProductImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageType[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const SWIPE_THRESHOLD = 40;

export default function ProductImageLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}: ProductImageLightboxProps) {
  const [direction, setDirection] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const isZoomed = zoomScale > 1;

  // Reset zoom state when image changes
  useEffect(() => {
    setZoomScale(1);
    setZoomOrigin({ x: 50, y: 50 });
  }, [currentIndex]);

  // Image pagination helper (prev / next)
  const paginate = useCallback(
    (newDirection: number) => {
      if (!images || images.length <= 1) return;
      let nextIndex = currentIndex + newDirection;
      if (nextIndex < 0) {
        nextIndex = images.length - 1;
      } else if (nextIndex >= images.length) {
        nextIndex = 0;
      }
      setDirection(newDirection);
      onIndexChange(nextIndex);
      setZoomScale(1);
      setZoomOrigin({ x: 50, y: 50 });
    },
    [currentIndex, images, onIndexChange]
  );

  // Preload adjacent images for smooth fast switching
  useEffect(() => {
    if (!isOpen || !images || images.length === 0) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;

    [images[prevIndex]?.path, images[nextIndex]?.path].forEach((src) => {
      if (src) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [currentIndex, images, isOpen]);

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
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        paginate(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose, paginate]);

  // Drag & swipe gesture navigation when not zoomed
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isZoomed) return;
    if (info.offset.x < -SWIPE_THRESHOLD) {
      paginate(1);
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      paginate(-1);
    }
  };

  // Handle tap on image to toggle zoom targeted at click position
  const handleImageTap = (_: any, info: any) => {
    if (isZoomed) {
      setZoomScale(1);
      setZoomOrigin({ x: 50, y: 50 });
    } else if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const xPercent = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((info.point.y - rect.top) / rect.height) * 100));
      setZoomOrigin({ x: xPercent, y: yPercent });
      setZoomScale(2.5);
    }
  };

  // Smooth mouse move panning when zoomed
  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isZoomed || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x: xPercent, y: yPercent });
  };

  if (!isOpen || !images || images.length === 0) return null;

  const currentImgSrc = images[currentIndex]?.path;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? '100%' : dir > 0 ? '-100%' : 0,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
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
            <div className="text-sm md:text-base font-medium text-white/90 tracking-widest pl-2 pointer-events-auto">
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

          {/* Main Full-Height Gallery Container */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Left Chevron Button (Hidden on small screens) */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
                className="hidden md:flex absolute left-3 md:left-8 z-40 p-3 rounded-full bg-black/50 hover:bg-white hover:text-black text-white backdrop-blur-md transition-all duration-200 transform hover:scale-110 focus:outline-none shadow-2xl items-center justify-center"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />
              </button>
            )}

            {/* Center Slide Container taking 100% height */}
            <div className="w-full h-full flex items-center justify-center p-0 relative overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag={isZoomed ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="w-full h-full flex items-center justify-center overflow-hidden"
                >
                  <motion.img
                    ref={imgRef}
                    src={currentImgSrc}
                    alt={`Product view ${currentIndex + 1}`}
                    onTap={handleImageTap}
                    onMouseMove={handleMouseMove}
                    style={{
                      transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)',
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }}
                    className={`h-full max-h-screen w-auto max-w-full object-contain transition-transform duration-200 ease-out will-change-transform ${
                      isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Chevron Button (Hidden on small screens) */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                className="hidden md:flex absolute right-3 md:right-8 z-40 p-3 rounded-full bg-black/50 hover:bg-white hover:text-black text-white backdrop-blur-md transition-all duration-200 transform hover:scale-110 focus:outline-none shadow-2xl items-center justify-center"
                aria-label="Next Image"
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
