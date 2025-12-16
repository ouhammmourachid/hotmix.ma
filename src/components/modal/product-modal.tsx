import React from 'react';
import { MoveUpRight, Check } from 'lucide-react';
import { Rating } from '@/components/small-pieces';
import { XButton } from '@/components/small-pieces';
import { Size, ThreeButtons } from '@/components/small-pieces';
import { useState, useRef } from 'react';
import ModalLayout from '@/components/modal/modal-layout';
import Product from '@/types/product';
import SizeType from '@/types/size';
import Color from '@/types/color';
import { useCart } from '@/contexts/cart-context'
import Link from 'next/link';
import styles from '@/styles/modal.module.css';
import { motion } from 'framer-motion';
import filterStyles from '@/styles/filter.module.css';
import { formatPrice } from '@/lib/utils';
import { Discount } from '@/components/ui/discount';
// Import for translation support - will be used later
import { useTranslation } from '@/lib/i18n-utils';

const ProductModal = ({
  isOpen,
  product,
  onClose,
  onCartOpen
}: {
  isOpen: boolean,
  product: Product,
  onClose: () => any,
  onCartOpen?: () => void
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(product.colors?.[0]);
  const { addToCart } = useCart()
  const modalRef = useRef(null);
  const price = product.sale_price ? product.sale_price : product.price;
  // Initialize translation hook - will be used later for translating components
  const { t, language } = useTranslation();
  const isRTL = language === 'ar'; // Check if current language is RTL (Arabic)
  const animationConfig = {
    // Adjust animation direction for RTL languages
    initial: { x: isRTL ? 300 : -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: isRTL ? -300 : 300, opacity: 0 },
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
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalRef={modalRef}
      className={styles.product_modal}
      modalId="product-modal">
      <motion.div
        {...animationConfig}
        transition={isOpen ? transitionConfig.enter : transitionConfig.exit}
        ref={modalRef}
        className={styles.product}>
        {/* Close button */}
        <XButton
          className='text-white hover:text-greny'
          onClick={onClose} />

        {/* Product image */}
        <div className="w-1/2 bg-white">
          <img
            src={product.images?.[0]?.path}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product details */}
        <div className="w-1/2 p-8">
          <Link
            href={`/products/${product.id}`}>
            <h2 className={styles.product_header}>
              {product.name}
            </h2>
          </Link>


          {/* Rating */}
          <Rating rating={4.6} withNumber />

          {/* Price */}
          <div className={styles.product_prices}>
            <span className={styles.product_sale_price}>
              {formatPrice(product.sale_price ? product.sale_price : product.price)} DH
            </span>
            {product.sale_price && (
              <span className={styles.product_price}>
                {formatPrice(product.price, 'DH', language)}
              </span>
            )}
            <Discount
              discount={product.discount}
              withOff
              className={styles.product_discount}
              size='sm'
              variant='default' />
          </div>
          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>
                  {t('color')}: {selectedColor?.name}
                </span>
              </div>
              <div className="flex gap-2">
                {product.colors.map((color: Color) => (
                  <div
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className="relative cursor-pointer w-8 h-8"
                    title={color.name}
                  >
                    <div className={`${filterStyles.filter_color_ring} ${selectedColor?.id === color.id ? 'border-2' : ''}`} />
                    <div
                      style={{ backgroundColor: color.code }}
                      className={filterStyles.filter_color_circle}
                    >
                      {selectedColor?.id === color.id && <Check size={15} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Size selector */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">              <span>
              {t('size')}: {selectedSize?.name}
            </span>
            </div>
            <div className="flex gap-2">
              {product.sizes?.map((size: SizeType) => (
                <Size
                  key={size.id}
                  size={size}
                  selectedSize={selectedSize}
                  onClick={() => setSelectedSize(size)} />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <ThreeButtons
              quantity={1}
              productId={product.id}
              price={price}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onClickAddToCart={() => addToCart({
                id: 0,
                product: product,
                price: product.sale_price ? product.sale_price : product.price,
                size: selectedSize,
                color: selectedColor,
                quantity: 1
              })}
              onCartOpen={onCartOpen} />
            <Link
              href={`/products/${product.id}`}
              className={styles.product_link_detail}>
              {t('product_details')} {<MoveUpRight size={16} className={`mt-0.5 ${isRTL ? 'transform rotate-180' : ''}`} />}
            </Link>
          </div>
        </div>
      </motion.div>
    </ModalLayout >
  );
};

export default ProductModal;
