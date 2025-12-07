"use client";
import React from 'react';
import { useCart } from '@/contexts/cart-context';
import CartItemType from '@/types/cart-item';
import { QuantityChanger } from '@/components/small-pieces';
import styles from '@/styles/cart.module.css';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-utils';
import { useLanguage } from '@/contexts/language-context';

function RenderItem({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCart();
  const { t } = useTranslation();
  const calculateTotal = () => {
    return item.price * item.quantity;
  };

  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div key={item.id} className={styles.render_cart_item_page}>
      <div className={`flex gap-4 ${isRTL ? styles.rtl_cart_item : ''}`}>
        <Link
          href={`/products/${item.product.id}`}>
          <img
            src={item.product.images[0].path}
            alt={item.product.name}
            className={styles.render_cart_item_page_img}
          />
        </Link>
        <div className={styles.render_cart_item_page_info}>
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm text-gray-400">{item.size?.name}</p>
          <button
            onClick={() => (removeFromCart(item.id))}
            className={styles.render_cart_item_page_info_remove}>
            {t('cart_item_remove')}
          </button>
        </div>
      </div>
      <div className={styles.render_cart_item_page_info_prices}>
        {item.product.sale_price && item.product.sale_price !== item.product.price && (
          <span
            className={styles.cart_item_price}>
            {formatPrice(item.product.price)} DH
          </span>
        )}
        <span
          className={styles.cart_item_sale_price}>
          {formatPrice(item.product.sale_price ? item.product.sale_price : item.product.price)} DH
        </span>
      </div>
      <div className='hidden md:flex'>
        <QuantityChanger
          quantity={item.quantity}
          setQuantity={(quantity) => updateQuantity(item.id, quantity)}
          small />
      </div>
      <div className='text-end hidden md:flex'>{formatPrice(calculateTotal())} DH</div>
      <div className='w-full md:hidden'>
        <div className='flex flex-col items-start border-b border-dashed border-gray-700 py-3'>
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm text-gray-400">{item.size?.name}</p>
          <button
            onClick={() => (removeFromCart(item.id))}
            className={styles.render_cart_item_page_info_remove}>
            Remove
          </button>
        </div>
        <div className='flex flex-row justify-between border-b border-dashed border-gray-700 py-3'>
          <div>{t('cart_price')}</div>
          <div className='space-x-2'>
            {item.product.sale_price && item.product.sale_price !== item.product.price && (
              <span
                className={styles.cart_item_price}>
                {formatPrice(item.product.price)} DH
              </span>
            )}
            <span
              className={styles.cart_item_sale_price}>
              {formatPrice(item.product.sale_price ? item.product.sale_price : item.product.price)} DH
            </span>
          </div>
        </div>
        <div className={styles.render_cart_item_page_info_quantity}>
          <div>{t('cart_item_quantity')}</div>
          <QuantityChanger
            quantity={item.quantity}
            setQuantity={(quantity) => updateQuantity(item.id, quantity)}
            small />
        </div>
        <div className={styles.render_cart_item_page_info_total}>
          <div>{t('cart_total')}</div>
          <div>{formatPrice(calculateTotal())} DH</div>
        </div>
      </div>
    </div>
  );
}

const CheckoutSubtotal = () => {
  const { subtotal } = useCart();
  const { t } = useTranslation();
  return (
    <div className={styles.checkout_subtotal_page}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">{t('cart_subtotal')}</h3>
        <span className="text-xl">{formatPrice(subtotal)} DH</span>
      </div>
      <div className="text-gray-300 text-sm mb-6">
        {t('cart_tax_included')} {' '}
        <Link href="/shipping" className="underline hover:text-white">
          {t('cart_shipping')}
        </Link>
        {' '}{t('cart_calculate_shipping')}.
      </div>
      <Link
        href="/checkout"
        className={styles.checkout_subtotal_page_link}>
        {t('cart_checkout')}
      </Link>
    </div>
  );
};

const ShoppingCart = () => {
  const { cartItems } = useCart();
  const { t } = useTranslation();

  return (
    <div className={styles.shopping_cart}>
      <div className={styles.shopping_cart_title}>{t('cart_modal_title')}</div>
      <div className='flex xl:flex-row flex-col'>
        <div className='flex flex-col'>
          <div className="space-y-6">
            <div>
              <div className={styles.shopping_cart_table_header}>
                <div>{t('cart_product')}</div>
                <div>{t('cart_price')}</div>
                <div>{t('cart_item_quantity')}</div>
                <div className='text-center'>{t('cart_total')}</div>
              </div>
              <div className="space-y-4">
                {cartItems.map((item: CartItemType) => (
                  <RenderItem
                    key={item.id}
                    item={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-md mb-2">{t('cart_add_note')}</h3>
            <textarea
              placeholder={t('cart_note_placeholder')}
              className={styles.shopping_cart_textarea}
              rows={4}
            />
          </div>
        </div>
        <CheckoutSubtotal />
      </div>
    </div>
  );
};

export default ShoppingCart;
