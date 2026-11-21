import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, User, Heart, Filter } from 'lucide-react';
import Basket from '@/components/icon/basket';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useFilter } from '@/contexts/filter-context';
import styles from '@/styles/main.module.css';
import { useTranslation } from '@/lib/i18n-utils';

const ICON = 'h-6 w-6';
const LABEL = 'text-[10.5px] leading-none font-medium tracking-[0.01em]';

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className={styles.bottom_nav_button_span + ' top-1.5 start-1/2 ms-2.5'}>
      {count}
    </span>
  );
}

export default function BottomNavigation({
  onCartClick,
}: {
  onCartClick: () => void,
}) {
  const { totalItems } = useCart();
  const { totalWishList } = useWishlist();
  const { isFilterOpen, setIsFilterOpen } = useFilter();
  const { t } = useTranslation();
  const pathname = usePathname() || '';

  const isActive = (prefix: string) => pathname.startsWith(prefix);
  const tone = (active: boolean) => (active ? ' !text-greny' : '');

  return (
    <nav aria-label="Primary" className={styles.bottom_nav + " bottom-nav"}>
      <Link
        href="/products"
        aria-current={isActive('/products') ? 'page' : undefined}
        className={styles.bottom_nav_button + tone(isActive('/products'))}>
        <LayoutGrid className={ICON} strokeWidth={1.75} />
        <span className={LABEL}>{t('bottom_nav_shop')}</span>
      </Link>

      <button
        type="button"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        aria-pressed={isFilterOpen}
        className={styles.bottom_nav_button + tone(isFilterOpen)}>
        <Filter className={ICON} strokeWidth={1.75} />
        <span className={LABEL}>{t('bottom_nav_filter')}</span>
      </button>

      <Link
        href="/account"
        aria-current={isActive('/account') ? 'page' : undefined}
        className={styles.bottom_nav_button + tone(isActive('/account'))}>
        <User className={ICON} strokeWidth={1.75} />
        <span className={LABEL}>{t('bottom_nav_account')}</span>
      </Link>

      <Link
        href="/wishlist"
        aria-current={isActive('/wishlist') ? 'page' : undefined}
        className={styles.bottom_nav_button + tone(isActive('/wishlist'))}>
        <Heart className={ICON} strokeWidth={1.75} />
        <span className={LABEL}>{t('bottom_nav_wishlist')}</span>
        <Badge count={totalWishList} />
      </Link>

      <button
        type="button"
        onClick={onCartClick}
        className={styles.bottom_nav_button}>
        <Basket className={ICON} />
        <span className={LABEL}>{t('bottom_nav_cart')}</span>
        <Badge count={totalItems} />
      </button>
    </nav>
  );
};
