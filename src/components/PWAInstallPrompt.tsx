"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    deferredPWAInstallPrompt?: BeforeInstallPromptEvent;
  }
}

export default function PWAInstallPrompt() {
  const { t, language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Mobile-only check
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
    const isMobileScreen = window.innerWidth <= 768;
    const isMobile = isMobileUA || isMobileScreen;

    if (!isMobile) return;

    // Check if app is already running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // Check dismiss cooldown (7 days)
    const dismissedTime = localStorage.getItem("pwa_prompt_dismissed");
    if (dismissedTime) {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime, 10) < sevenDaysMs) {
        return;
      }
    }

    // Detect iOS
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (iosDevice) {
      setIsIOS(true);
      const timer = setTimeout(() => setShowPrompt(true), 2500);
      return () => clearTimeout(timer);
    }

    // Check if prompt was caught earlier by window listener
    if (window.deferredPWAInstallPrompt) {
      setDeferredPrompt(window.deferredPWAInstallPrompt);
      setShowPrompt(true);
    }

    // Catch future event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const pwaEvent = e as BeforeInstallPromptEvent;
      window.deferredPWAInstallPrompt = pwaEvent;
      setDeferredPrompt(pwaEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPWAInstallPrompt;
    if (!promptEvent) return;

    setShowPrompt(false);
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      console.log("Mobile user installed Hotmix PWA");
    }
    setDeferredPrompt(null);
    window.deferredPWAInstallPrompt = undefined;
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
        initial={{ opacity: 0, y: -50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.96 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-[100] p-2.5 rounded-xl bg-primary/95 backdrop-blur-md border border-secondary shadow-xl shadow-black/40 text-white ${
          isRTL ? "rtl" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between gap-2.5">
          {/* Icon & Details */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-secondary/80 border border-greny/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-greny" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-xs text-white leading-tight truncate">
                {t("pwa_install_title")}
              </h3>
              <p className="text-[11px] text-whity/80 leading-tight truncate mt-0.5">
                {t("pwa_install_desc")}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="flex items-center justify-center gap-1 text-[11px] font-bold bg-greny hover:bg-greny/90 text-primary px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("pwa_install_btn")}</span>
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="text-whity/70 hover:text-white p-1 rounded-lg hover:bg-secondary/60 transition-colors shrink-0"
              aria-label={t("pwa_dismiss")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iOS Instruction banner if iOS */}
        {isIOS && (
          <div className="mt-2 text-[11px] text-whity bg-secondary/60 p-2 rounded-lg flex items-center gap-2 border border-secondary">
            <Share className="w-3.5 h-3.5 text-greny shrink-0" />
            <span className="leading-tight">{t("pwa_ios_instruction")}</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
