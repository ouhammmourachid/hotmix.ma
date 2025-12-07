import React, { useState, useRef, useEffect } from 'react';
import { Discount } from '@/components/ui/discount';
import { Size, ThreeButtons, XButton, QuantityChanger } from '@/components/small-pieces';
import ModalLayout from '@/components/modal/modal-layout';
import Product from '@/types/product';
import SizeType from '@/types/size';
import { useCart } from '@/contexts/cart-context';
import styles from '@/styles/modal.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-utils';

export default function QuickAddModal({
  product,
  isOpen,
  onClose,
  onCartOpen
}: {
  product: Product,
  isOpen: boolean,
  onClose: () => any,
  onCartOpen?: () => void,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<SizeType | undefined>(product.sizes?.[0]);
  const modalRef = useRef(null);
  const price = product.sale_price ? product.sale_price : product.price;
  const { addToCart } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  // Initialize translation hook
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust for mobile screens
    };

    handleResize(); // Set on initial render
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animationConfig = isMobile
    ? {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
    }
    : {
      initial: { x: -100, opacity: 1 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 100, opacity: 1 },
    };

  const transitionConfig = {
    enter: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.5
    },
    exit: {
      duration: 0.5
    }
  };
  const handleClickAddToCart = () => {
    addToCart({
      id: 0,
      product: product,
      size: selectedSize,
      quantity: quantity,
      price: price
    })
    setQuantity(1);
    onCartOpen?.();
  }
  return (
    <ModalLayout
      modalRef={modalRef}
      isOpen={isOpen}
      onClose={onClose}
      className={styles.quick_add_modal}
      modalId="quick-add-modal">
      <motion.div
        {...animationConfig}
        transition={isOpen ? transitionConfig.enter : transitionConfig.exit}
        ref={modalRef}
        className={styles.quick_add}>
        {/* Close Button */}
        <XButton
          className='hover:text-greny'
          onClick={onClose} />
        {/* Product Details */}
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <div className="w-20 h-28 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0">
            <img
              src={product.images?.[0]?.path}
              alt="Gaming Time Black"
              width={80}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            {/* Product Title and Price */}
            <Link
              href={`/products/${product.id}`}>
              <h2 className={styles.quick_add_header}>{product.name}</h2>
            </Link>

            <div className={styles.quick_add_prices}>
              <span
                className={styles.quick_add_sale_price}>
                {formatPrice(product.sale_price && product.sale_price !== product.price ? product.sale_price : product.price)} DH
              </span>
              {product.sale_price && product.sale_price !== product.price && (
                <span
                  className={styles.quick_add_price}>
                  {formatPrice(product.price)} DH
                </span>
              )}
              <Discount
                discount={product.discount}
                withOff
                className={styles.quick_add_discount}
                size='sm'
                variant='default' />

            </div>
          </div>
        </div>
        {/* Sizes  and quantity and buttons */}
        <div className='mt-4 flex flex-col gap-4'>
          {/* sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-col gap-4">
              <span>{t('size')}: {selectedSize?.name}</span>
              <div className="flex gap-2">
                {product.sizes.map((size: SizeType) => (
                  <Size
                    key={size.id}
                    size={size}
                    selectedSize={selectedSize}
                    onClick={() => setSelectedSize(size)}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Quantity */}
          <div className="flex flex-col gap-4">
            <span>{t('quantity')}</span>
            <QuantityChanger quantity={quantity} setQuantity={setQuantity} />
          </div>
          {/* Buttons */}
          <ThreeButtons
            quantity={quantity}
            productId={product.id}
            price={price * quantity}
            selectedSize={selectedSize}
            onClickAddToCart={handleClickAddToCart}
            onCartOpen={onCartOpen}
          />
        </div>
      </motion.div>
    </ModalLayout>
  );
};
