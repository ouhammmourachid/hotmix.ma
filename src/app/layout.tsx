import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageViewTracker from "@/components/PageViewTracker";
import { LanguageProvider } from "@/contexts/language-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HotMix - Elegant and Minimalist Clothing for Modern Women",
  description: "Discover HotMix, a women's clothing brand that embraces elegance and simplicity. Explore our collection of minimalist and comfortable pieces designed to empower modern women with timeless style.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* This script runs immediately to prevent language flash */}
        <script
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
