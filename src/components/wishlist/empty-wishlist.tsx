import React from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import styles from '@/styles/wishlist.module.css';
import { useTranslation } from '@/lib/i18n-utils';

export default function emptyWishList(){
  const { t } = useTranslation();
  
  return (
    <div className={styles.empty_wishlist}>
      <div className={styles.wishlist_header}>
        <h1 className="text-4xl font-bold text-center">{t('wishlist_title')}</h1>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 ">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Heart className="w-16 h-16 stroke-1 text-teal-600" />
          <h2 className="text-2xl font-medium text-center">
            {t('wishlist_empty_title')}
          </h2>
          <p className="text-center text-gray-300 max-w-md">
            {t('wishlist_empty_description')}
          </p>
          <Link
            href="/products"
            className={styles.empty_wishlist_link}
          >
            {t('wishlist_return_to_shop')}
          </Link>
        </div>
      </div>
    </div>
  );
};
