import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FacebookIcon, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
import Tiktok from "@/components/icon/tiktok";
import { ScrollArrow } from '@/components/small-pieces';
import styles from '@/styles/main.module.css';
import Link from "next/link";
import { useTranslation } from '@/lib/i18n-utils';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="pt-16 pb-6">
      <div className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-12 pb-7 lg:mx-20 mx-4">          {/* About Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">{t('footer_about_title')}</h3>
          <p className="text-gray-300 leading-relaxed">
            {t('footer_about_description')}
          </p>
          <Link
            href="/products"
            className="w-fit p-0 flex items-center hover:text-greny border-b hover:border-greny"
          >
            {t('footer_discover_products')}
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {/* Social Media Links */}
          <div className="flex gap-4">
            <a href="#" className={styles.social_media + ' hover:text-blue-500 hover:border-blue-500'}>
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/hotmix.ma/" className={styles.social_media + ' hover:text-pink-500 hover:border-pink-500'}>
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@Hotmix-ma" className={styles.social_media + ' hover:text-red-500 hover:border-red-500'}>
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.tiktok.com/@hotmix.ma" className={styles.social_media + ' hover:text-red-500 hover:border-red-500'}>
              <Tiktok className="w-5 h-5" />
            </a>
          </div>
        </div>          {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">{t('footer_quick_links')}</h3>
          <ul className="space-y-4">
            {[
              { key: 'footer_about_us', text: 'About us' },
              { key: 'footer_contact_us', text: 'Contact us' },
              { key: 'footer_faqs', text: 'FAQs' },
              { key: 'footer_shipping', text: 'Shipping & Delivery' },
              { key: 'footer_returns', text: 'Return & Exchange' },
              { key: 'footer_privacy', text: 'Privacy Policy' }
            ].map((link) => (
              <li key={link.key}>
                <a href="#" className="hover:text-greny transition-colors">
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>          {/* Newsletter */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">
            {t('footer_newsletter_title')}
          </h3>
          <p className="text-gray-300">
            {t('footer_newsletter_description')}
          </p>
          <div className="flex bg-white p-2 rounded-sm">
            <Input
              type="email"
              placeholder={t('footer_email_placeholder')}
              className={styles.footer_subscribe_input}
            />
            <Button className={styles.footer_subscribe_button}>
              {t('footer_subscribe')} <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Scroll Arrow */}
      <ScrollArrow />        {/* Bottom Section */}
      <div className={styles.footer_copyright}>
        <div className="flex flex-col items-center md:items-start space-y-2 md:space-y-0 md:flex-row md:justify-between w-full text-sm text-gray-400">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>{t('footer_copyright')}</p>
          </div>
          <div className="flex items-center gap-3">
            <img src="/visa.png" alt="Visa" className="h-6 bg-white rounded" />
            <img src="/mastercard.png" alt="Mastercard" className="h-6 bg-white rounded" />
            <img src="/cmi.png" alt="CMI" className="w-10 h-[24px] py-1 px-1 bg-white rounded" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
