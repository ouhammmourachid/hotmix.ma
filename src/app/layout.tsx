import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";

import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageViewTracker from "@/components/PageViewTracker";
import SWRegister from "@/components/SWRegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import DisableZoomStandalone from "@/components/DisableZoomStandalone";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";
import VercelAnalytics from "@/components/VercelAnalytics";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_WIDTH, DEFAULT_OG_IMAGE_HEIGHT } from "@/lib/seo";
import JsonLd from "@/components/json-ld";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const DEFAULT_TITLE = "Hotmix - Elegant and Minimalist Clothing for Modern Women";
const DEFAULT_DESCRIPTION = "Discover Hotmix, a women's clothing brand that embraces elegance and simplicity. Explore our collection of minimalist and comfortable pieces designed to empower modern women with timeless style.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hotmix",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: `${SITE_URL}${DEFAULT_OG_IMAGE}`, width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
};

export const viewport: Viewport = {
  themeColor: "#09282e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Hotmix" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* PWA install prompt — must run before React hydration (beforeInteractive) */}
        <Script
          id="pwa-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.deferredPWAInstallPrompt = e;
              });
              (function() {
                try {
                  var isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                                     window.navigator.standalone === true ||
                                     document.referrer.indexOf('android-app://') !== -1;
                  if (isStandalone) {
                    document.documentElement.classList.add('pwa-standalone');
                    var meta = document.querySelector('meta[name="viewport"]');
                    if (meta) {
                      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Language detection — must run before React hydration to prevent language flash */}
        <Script
          id="lang-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedLang = localStorage.getItem('language');
                  var lang = 'ar';
                  var dir = 'rtl';
                  
                  if (storedLang && ['en', 'fr', 'ar'].includes(storedLang)) {
                    lang = storedLang;
                  } else {
                    var browserLangs = navigator.languages || [navigator.language];
                    var primaryCodes = browserLangs.map(function(l) { return l.split('-')[0]; });
                    var supported = ['en', 'fr', 'ar'];
                    
                    for (var i = 0; i < primaryCodes.length; i++) {
                      if (supported.includes(primaryCodes[i])) {
                        lang = primaryCodes[i];
                        break;
                      }
                    }
                  }
                  
                  dir = lang === 'ar' ? 'rtl' : 'ltr';
                  document.documentElement.lang = lang;
                  document.documentElement.dir = dir;
                } catch (e) {
                  console.error('Error setting initial language:', e);
                }
              })();
            `,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/icon-512.png`,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
      </head>
      <body
        className={`${outfit.variable} antialiased`}
      >
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2421906261576995&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <SWRegister />
        <DisableZoomStandalone />
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <PWAInstallPrompt />
          </LanguageProvider>
        </AuthProvider>

        {/* Vercel Analytics + Speed Insights — wrapped in client component for Turbopack */}
        <VercelAnalytics />

        {/* Meta Pixel — deferred so it doesn't block First Contentful Paint */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2421906261576995');
              fbq('track', 'PageView');
            `,
          }}
        />
      </body>
    </html>
  );
}
