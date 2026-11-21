"use client";
import React from 'react';
import NewsletterForm from "@/components/newsletter-form";
import { FacebookIcon, Instagram, Youtube, ChevronRight } from 'lucide-react';
import Tiktok from "@/components/icon/tiktok";
import { ScrollArrow } from '@/components/small-pieces';
import styles from '@/styles/main.module.css';
import Link from "next/link";
import { useTranslation } from '@/lib/i18n-utils';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isProductPage = Boolean(pathname?.startsWith('/products/') && pathname !== '/products');

  return (
    <footer className="pt-14 pb-6 border-t border-separator bg-[#07222a]">
      <div className="container mx-auto grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 pb-10 px-4 lg:px-12">
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-subhead font-semibold text-label">{t('footer_about_title')}</h3>
          <p className="text-footnote text-label-2 leading-relaxed max-w-sm">
            {t('footer_about_description')}
          </p>
          <Link
            href="/products"
            className="w-fit flex items-center gap-0.5 text-footnote font-medium text-greny hover:underline underline-offset-4"
          >
            {t('footer_discover_products')}
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </Link>

          {/* Social Media Links */}
          <div className="flex gap-2 pt-2">
            <a href="#" className={styles.social_media} aria-label="Facebook">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/hotmix.ma/" className={styles.social_media} aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@Hotmix-ma" aria-label="YouTube" className={styles.social_media}>
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.tiktok.com/@hotmix.ma" aria-label="TikTok" className={styles.social_media}>
              <Tiktok className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-subhead font-semibold text-label">{t('footer_quick_links')}</h3>
          <ul className="space-y-2.5">
            {[
              { key: 'footer_about_us', href: '/about-us' },
              { key: 'footer_contact_us', href: '/contact-us' },
              { key: 'footer_faqs', href: '/faqs' },
              { key: 'footer_shipping', href: '/shipping-delivery' },
              { key: 'footer_returns', href: '/return-exchange' },
              { key: 'footer_privacy', href: '/privacy-policy' }
            ].map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="text-footnote text-label-2 hover:text-label transition-colors">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <NewsletterForm />
      </div>
      {/* Scroll Arrow */}
      <ScrollArrow />

      {/* Bottom Section */}
      <div className={`${styles.footer_copyright} ${isProductPage ? 'pb-36 lg:pb-20' : 'pb-16 lg:pb-4'}`}>
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between w-full pt-6 border-t border-separator text-caption text-label-3">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>{t('footer_copyright')}</p>
          </div>
          <div className="flex items-center gap-3">
            <img src="/visa.png" alt="Visa" className="h-6 bg-white rounded-md" />
            <img src="/mastercard.png" alt="Mastercard" className="h-6 bg-white rounded-md" />
            <img src="/cmi.png" alt="CMI" className="w-10 h-[24px] py-1 px-1 bg-white rounded-md" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
