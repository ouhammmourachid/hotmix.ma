import { ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from '@/styles/cart.module.css';
import { useTranslation } from '@/lib/i18n-utils';

export default function EmptyCartPage() {
    const { t } = useTranslation();
    
    return (
        <div className={styles.empty_cart_page}>
        {/* Header */}
        <h1>{t('cart_modal_title')}</h1>

        {/* Empty Cart Message */}
        <div className="space-y-4">
          {/* Cart Icon */}
          <div className="flex justify-center">
            <ShoppingCart size={48} className="text-teal-100/80" />
          </div>

          {/* Empty Message */}
          <h2>{t('cart_empty_title')}</h2>

          {/* Subtext */}
          <p>{t('cart_empty_description')}</p>

          {/* Return to Shop Button */}
          <div className="pt-6">
            <Link
              href="/products"
              className={styles.empty_cart_page_link}>
              <span>{t('cart_return_to_shop')}</span>
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
}
