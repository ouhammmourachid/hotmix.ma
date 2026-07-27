"use client";

import { useEffect } from "react";

/**
 * Disables pinch-to-zoom and multi-touch zoom on mobile devices
 * strictly when the website is launched as an installed PWA (standalone mode).
 */
export default function DisableZoomStandalone() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    if (!isStandalone) return;

    // Apply CSS class to html element
    document.documentElement.classList.add("pwa-standalone");

    // Update viewport meta tag to disable zoom
    let meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    } else {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
      document.head.appendChild(meta);
    }

    // iOS Safari prevention for pinch-to-zoom & double-tap gestures
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    const preventTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("gesturestart", preventGesture, { passive: false });
    document.addEventListener("gesturechange", preventGesture, { passive: false });
    document.addEventListener("gestureend", preventGesture, { passive: false });
    document.addEventListener("touchstart", preventTouchStart, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("touchstart", preventTouchStart);
    };
  }, []);

  return null;
}
