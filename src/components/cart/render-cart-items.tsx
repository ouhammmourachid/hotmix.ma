import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { QuantityChanger } from '@/components/small-pieces';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/contexts/cart-context';
import Product from '@/types/product';
import CartItemType from '@/types/cart-item';
import styles from '@/styles/cart.module.css';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-utils';

const emptyCart = (onClose: () => void) => {
  const { t } = useTranslation();
  return (
    <div className={styles.empty_cart}>
      <h3>{t('cart_empty_title')}</h3>
      <p>
        {t('cart_empty_description')}
      </p>
      <Link
        onClick={onClose}
        href="/products"
        className={styles.empty_cart_link}
      >
        {t('cart_return_to_shop')}
        <MoveUpRight className="ml-2 w-4 h-4" />
      </Link>
    </div>

  )
}



export const CheckoutSubtotal = ({ className, onClose }: { className?: string, onClose: () => void }) => {
  const { subtotal } = useCart();
  const { t } = useTranslation();
  return (
    <div className={styles.cart_checkout + ' ' + className}>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-1">{t('cart_subtotal')}</h2>
        <div className="text-2xl font-bold">
          {formatPrice(subtotal)} DH
        </div>
      </div>

      <div className="text-gray-300 text-sm mb-6">
        {t('cart_tax_included')}. {' '}
        <Link href="/shipping" className="underline hover:text-white">
          {t('cart_shipping')}
        </Link>
        {' '}{t('cart_calculate_shipping')}.
      </div>

      <div className={styles.cart_checkout_links}>
        <Link
          onClick={onClose}
          href="/cart"
          className={styles.cart_checkout_view_link}
        >
          {t('cart_view')}
        </Link>
        <Link
          onClick={onClose}
          href="/checkout"
          className={styles.cart_checkout_link}
        >
          {t('cart_checkout')}
        </Link>
      </div>
    </div>
  );
};


function CartItem({
  item,
  onClickRemove,
  updateQuantity,
  onClose,
  isLast
}: {
  item: CartItemType,
  onClickRemove: () => void,
  updateQuantity: (cartId: number, quantity: number) => void,
  onClose: () => void,
  isLast?: boolean
}) {
  const product: Product = item.product
  const [quantity, setQuantity] = useState(item.quantity)
  const { t } = useTranslation();

  useEffect(() => {
    updateQuantity(item.id, quantity)
  }, [quantity])
  return (
    <div className={`flex items-center gap-4 p-4 ${!isLast && "border-b"} border-teal-800 mx-7`}>
      <Link
        onClick={onClose}
        href={`/products/${product.id}`}>
        <img
          src={product.images[0].path}
          alt={product.name}
          className={styles.cart_item_img}
        />
      </Link>
      <div className="flex flex-col gap-2 items-start">
        <Link
          onClick={onClose}
          href={`/products/${product.id}`}>
          <h4 className={styles.cart_item_name}>
            {product.name}
          </h4>
        </Link>
        <p className={styles.cart_item_size}>
          {item.size?.name} {item.color ? `| ${item.color.name}` : ''}
        </p>
        <div className='flex items-center gap-2'>
          {product.sale_price && product.sale_price !== product.price && (
            <span
              className={styles.cart_item_price}>
              {formatPrice(product.price)} DH
            </span>
          )}
          <span
            className={styles.cart_item_sale_price}>
            {formatPrice(product.sale_price ? product.sale_price : product.price)} DH
          </span>
        </div>
        <div className='flex flex-row gap-3' >
          <QuantityChanger
            className=''
            quantity={quantity}
            setQuantity={setQuantity} small />
          <span
            className={styles.cart_item_remove}
            onClick={onClickRemove}>{t('cart_item_remove')}</span>
        </div>
      </div>
    </div >
  )
}


export function RenderCartItems({
  cartItems,
  onRemove,
  onClose,
  onQuantityChange }:
  {
    cartItems: any,
    onRemove: (id: number) => void,
    onClose: () => void,
    onQuantityChange: (id: number, quantity: number) => void
  }) {
  return (
    <div className={styles.render_cart_items}>
      {
        cartItems.length === 0 ?
          emptyCart(onClose) :
          <><ScrollArea className="flex-1 mb-[80px]">
            <div className="flex flex-col gap-0">
              {cartItems.map((item: any, index: number) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onClickRemove={() => onRemove(item.id)}
                  updateQuantity={onQuantityChange}
                  onClose={onClose}
                  isLast={index + 1 == cartItems.length} />
              ))}
            </div>
          </ScrollArea>
            <div className="sticky bottom-0">
              <CheckoutSubtotal
                onClose={onClose}
                className="w-full" />
            </div>
          </>
      }

    </div>
  );
}
