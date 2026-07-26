"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, PlusSquare, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstallPrompt() {
  const { t, language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed / running as standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // Check if user dismissed prompt in this session / last 7 days
    const dismissedTime = localStorage.getItem("pwa_prompt_dismissed");
    if (dismissedTime) {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime, 10) < sevenDaysMs) {
        return;
      }
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    
    if (iosDevice) {
      setIsIOS(true);
      // Delay showing iOS hint slightly for smooth UX
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Handle standard BeforeInstallPromptEvent (Android, Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setShowPrompt(false);
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the PWA install prompt");
    } else {
      console.log("User dismissed the PWA install prompt");
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa_prompt_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  const isRTL = language === "ar";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-4 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 shadow-2xl text-white ${
          isRTL ? "rtl" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header section with icon, title, and close button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 via-neutral-800 to-amber-400/10 border border-neutral-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-neutral-100 leading-tight">
                {t("pwa_install_title")}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                {t("pwa_install_desc")}
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800/80 transition-colors shrink-0"
            aria-label={t("pwa_dismiss")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          {isIOS ? (
            <div className="w-full text-xs text-neutral-300 bg-neutral-800/60 p-2.5 rounded-lg flex items-center gap-2 border border-neutral-700/50">
              <Share className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t("pwa_ios_instruction")}</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleDismiss}
                className="text-xs text-neutral-400 hover:text-white px-3 py-2 rounded-lg hover:bg-neutral-800/60 transition-colors"
              >
                {t("pwa_dismiss")}
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-2 text-xs font-medium bg-amber-400 hover:bg-amber-300 text-neutral-950 px-4 py-2.5 rounded-xl shadow-lg shadow-amber-400/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>{t("pwa_install_btn")}</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
