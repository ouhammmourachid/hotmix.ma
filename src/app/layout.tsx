import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageViewTracker from "@/components/PageViewTracker";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";

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

        {/* Meta Pixel Code */}
        <script
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
              fbq('init', '1733693237299948');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1733693237299948&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <GoogleAnalytics />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
