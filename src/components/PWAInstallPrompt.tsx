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
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed bottom-4 left-3 right-3 z-50 p-4 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 shadow-2xl text-white ${
          isRTL ? "rtl" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/20 via-neutral-800 to-amber-400/10 border border-neutral-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-100 leading-tight">
                {t("pwa_install_title")}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">
                {t("pwa_install_desc")}
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors shrink-0"
            aria-label={t("pwa_dismiss")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          {isIOS ? (
            <div className="w-full text-xs text-neutral-300 bg-neutral-800/80 p-2.5 rounded-xl flex items-center gap-2 border border-neutral-700/60">
              <Share className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t("pwa_ios_instruction")}</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleDismiss}
                className="text-xs text-neutral-400 hover:text-white px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                {t("pwa_dismiss")}
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 px-4 py-2.5 rounded-xl shadow-lg shadow-amber-400/10 transition-all active:scale-95"
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
