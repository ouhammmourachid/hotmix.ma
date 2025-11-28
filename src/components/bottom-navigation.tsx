import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, User, Heart, Filter, Globe } from 'lucide-react';
import Basket from '@/components/icon/basket';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useFilter } from '@/contexts/filter-context';
import styles from '@/styles/main.module.css';
import { useTranslation } from '@/lib/i18n-utils';
import { useLanguage } from '@/contexts/language-context';
import LanguageSwitcher from './language-switcher';

export default function BottomNavigation({
                                          isCartOpen,
                                          onCartClick,
                                        }:{
                                          isCartOpen:boolean,
                                          onCartClick:()=>void,
                                        }) {
  const { totalItems } = useCart();
  const { totalWishList } = useWishlist();
  const { isFilterOpen, setIsFilterOpen } = useFilter();
  const { t } = useTranslation();
  return (
      <div className={styles.bottom_nav +" bottom-nav"}>
        {/* Shop */}
      <Link
        href="/products"
        className={styles.bottom_nav_button}>
        <LayoutGrid className="h-6 w-6" />
        <span className="text-sm mt-1">{t('bottom_nav_shop')}</span>
      </Link>

      {/* Filter */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={styles.bottom_nav_button}>
          <Filter className="h-6 w-6" />
          <span className="text-sm mt-1">{t('bottom_nav_filter')}</span>
      </button>

      {/* Account */}
      <Link
          href="/account"
          className={styles.bottom_nav_button}>
        <User className="h-6 w-6" />
        <span className="text-sm mt-1">{t('bottom_nav_account')}</span>
      </Link>

      {/* Wishlist */}
      <Link
          href="/wishlist"
          className={styles.bottom_nav_button}>
        <Heart className="h-6 w-6" />
        <span className="text-sm mt-1">{t('bottom_nav_wishlist')}</span>
        <span className={styles.bottom_nav_button_span + ' top-0 right-0'}>
          {totalWishList}
        </span>
      </Link>

      {/* Cart */}
      <button
          onClick={onCartClick}
          className={styles.bottom_nav_button}>
        <Basket className="h-6 w-6" />
        <span className="text-sm mt-1">{t('bottom_nav_cart')}</span>
        <span className={styles.bottom_nav_button_span + ' -top-1 -right-1'}>
          {totalItems}
        </span>
      </button>
    </div>
  );
};
