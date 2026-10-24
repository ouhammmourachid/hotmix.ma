"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const MAX_SCALE = 4;
const MIN_PINCH_SCALE = 0.8; // allows a little "rubber band" below 1 before snapping back
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;
const TAP_SLOP_PX = 10;

type Point = { x: number; y: number };
type View = { scale: number; x: number; y: number };
type Gesture =
  | { kind: 'pinch'; startView: View; startDistance: number; startMid: Point }
  | { kind: 'pan'; startView: View; startPoint: Point };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const touchPoint = (t: Touch): Point => ({ x: t.clientX, y: t.clientY });
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

// Full-screen image with pinch zoom, one-finger pan while zoomed and double-tap zoom on touch,
// click-to-zoom with cursor panning on desktop. At scale 1 horizontal swipes are left to the
// parent scroller, so it keeps its native swipe between images.
export default function ZoomableImage({ src, alt, active, eager, onZoomChange }: {
  src: string;
  alt: string;
  // Only the visible slide reacts; the others are reset to scale 1
  active: boolean;
  eager: boolean;
  onZoomChange: (zoomed: boolean) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const view = useRef<View>({ scale: 1, x: 0, y: 0 });
  const gesture = useRef<Gesture | null>(null);
  const tapStart = useRef<Point | null>(null);
  const lastTap = useRef<{ time: number; point: Point } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const isZoomedRef = useRef(false);
  const onZoomChangeRef = useRef(onZoomChange);
  onZoomChangeRef.current = onZoomChange;

  const boxCenter = (): Point => {
    const rect = boxRef.current!.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  // Writes the transform straight to the DOM so gestures don't re-render on every touchmove
  const apply = (scale: number, x: number, y: number, animate: boolean) => {
    const box = boxRef.current;
    const layer = layerRef.current;
    if (!box || !layer) return;

    // Only pan as far as the scaled image overflows the screen, so no empty edge is dragged into view
    const { width, height } = box.getBoundingClientRect();
    const img = imgRef.current;
    const ratio = img?.naturalWidth ? img.naturalWidth / img.naturalHeight : width / height;
    const imageWidth = Math.min(width, height * ratio);
    const imageHeight = Math.min(height, width / ratio);
    const maxX = Math.max(0, (imageWidth * scale - width) / 2);
    const maxY = Math.max(0, (imageHeight * scale - height) / 2);
    view.current = { scale, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };

    layer.style.transition = animate ? 'transform 0.25s ease-out' : 'none';
    layer.style.transform = `translate3d(${view.current.x}px, ${view.current.y}px, 0) scale(${scale})`;

    const zoomed = scale > 1.01;
    if (zoomed !== isZoomedRef.current) {
      isZoomedRef.current = zoomed;
      setIsZoomed(zoomed);
      onZoomChangeRef.current(zoomed);
    }
  };

  // Scale to `scale` so the image point that was under `anchor` (in view `from`) ends up under `target`
  const zoomAround = (from: View, anchor: Point, target: Point, scale: number, animate: boolean) => {
    const c = boxCenter();
    const imageX = (anchor.x - c.x - from.x) / from.scale;
    const imageY = (anchor.y - c.y - from.y) / from.scale;
    apply(scale, target.x - c.x - scale * imageX, target.y - c.y - scale * imageY, animate);
  };

  const reset = (animate: boolean) => apply(1, 0, 0, animate);

  useEffect(() => {
    if (!active) reset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !active) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const a = touchPoint(e.touches[0]);
        const b = touchPoint(e.touches[1]);
        gesture.current = { kind: 'pinch', startView: { ...view.current }, startDistance: distance(a, b), startMid: midpoint(a, b) };
        tapStart.current = null;
      } else if (e.touches.length === 1) {
        const point = touchPoint(e.touches[0]);
        tapStart.current = point;
        gesture.current = view.current.scale > 1.01
          ? { kind: 'pan', startView: { ...view.current }, startPoint: point }
          : null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (tapStart.current && e.touches.length === 1 && distance(tapStart.current, touchPoint(e.touches[0])) > TAP_SLOP_PX) {
        tapStart.current = null;
      }
      const g = gesture.current;
      if (!g) return; // unzoomed one-finger move: let the parent scroller swipe
      if (e.cancelable) e.preventDefault();

      if (g.kind === 'pinch' && e.touches.length >= 2) {
        const a = touchPoint(e.touches[0]);
        const b = touchPoint(e.touches[1]);
        const scale = clamp(g.startView.scale * (distance(a, b) / g.startDistance), MIN_PINCH_SCALE, MAX_SCALE);
        zoomAround(g.startView, g.startMid, midpoint(a, b), scale, false);
      } else if (g.kind === 'pan' && e.touches.length === 1) {
        const point = touchPoint(e.touches[0]);
        apply(g.startView.scale, g.startView.x + point.x - g.startPoint.x, g.startView.y + point.y - g.startPoint.y, false);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gesture.current?.kind === 'pinch') {
        if (view.current.scale <= 1.01) {
          gesture.current = null;
          reset(true);
        } else if (e.touches.length === 1) {
          // One finger still down after a pinch: carry on as a pan
          gesture.current = { kind: 'pan', startView: { ...view.current }, startPoint: touchPoint(e.touches[0]) };
        } else if (e.touches.length === 0) {
          gesture.current = null;
        }
        return;
      }
      if (e.touches.length > 0) return;
      gesture.current = null;

      const tap = tapStart.current;
      tapStart.current = null;
      if (!tap) return;
      const now = Date.now();
      const previous = lastTap.current;
      if (previous && now - previous.time < DOUBLE_TAP_MS && distance(previous.point, tap) < 30) {
        lastTap.current = null;
        // Stops the browser's own double-tap zoom and the emulated click
        if (e.cancelable) e.preventDefault();
        if (view.current.scale > 1.01) reset(true);
        else zoomAround(view.current, tap, tap, DOUBLE_TAP_SCALE, true);
      } else {
        lastTap.current = { time: now, point: tap };
      }
    };

    // iOS Safari fires its own gesture events for pinches; without this it zooms the whole page
    const preventPageZoom = (e: Event) => e.preventDefault();

    box.addEventListener('touchstart', handleTouchStart, { passive: true });
    box.addEventListener('touchmove', handleTouchMove, { passive: false });
    box.addEventListener('touchend', handleTouchEnd, { passive: false });
    box.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    box.addEventListener('gesturestart', preventPageZoom);
    return () => {
      box.removeEventListener('touchstart', handleTouchStart);
      box.removeEventListener('touchmove', handleTouchMove);
      box.removeEventListener('touchend', handleTouchEnd);
      box.removeEventListener('touchcancel', handleTouchEnd);
      box.removeEventListener('gesturestart', preventPageZoom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Desktop: click toggles zoom at the cursor, moving the mouse pans the zoomed image
  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !active) return;
    const point = { x: e.clientX, y: e.clientY };
    if (view.current.scale > 1.01) reset(true);
    else zoomAround(view.current, point, point, DOUBLE_TAP_SCALE, true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || view.current.scale <= 1.01) return;
    const c = boxCenter();
    const scale = view.current.scale;
    // Cursor at an edge of the screen shows that edge of the image
    apply(scale, -(scale - 1) * (e.clientX - c.x), -(scale - 1) * (e.clientY - c.y), false);
  };

  return (
    <div
      ref={boxRef}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      // pan-x keeps the native swipe between images; when zoomed every gesture is handled here
      style={{ touchAction: isZoomed ? 'none' : 'pan-x' }}
      className={`relative h-full w-full overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
    >
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          draggable={false}
          loading={eager ? 'eager' : 'lazy'}
          className="object-contain select-none"
        />
      </div>
    </div>
  );
}
