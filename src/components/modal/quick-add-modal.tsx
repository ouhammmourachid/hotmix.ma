import React, { useState, useRef, useEffect } from 'react';
import { Discount } from '@/components/ui/discount';
import { Check } from 'lucide-react';
import filterStyles from '@/styles/filter.module.css';
import Color from '@/types/color';
import { Size, ThreeButtons, XButton, QuantityChanger } from '@/components/small-pieces';
import ModalLayout from '@/components/modal/modal-layout';
import Product from '@/types/product';
import SizeType from '@/types/size';
import { useCart } from '@/contexts/cart-context';
import styles from '@/styles/modal.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice, isLightColor } from '@/lib/utils';
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
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(product.colors?.[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef(null);
  const price = product.sale_price ? product.sale_price : product.price;
  const { addToCart } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  const isArchived = product.status === "archived" || Boolean((product as any).is_archived) || Boolean((product as any).isArchived);

  const handleColorSelect = (color: Color) => {
    if (isArchived) return;
    setSelectedColor(color);

    if (product && product.images && product.images.length > 0) {
      const matchedIndex = product.images.findIndex((img: any) => {
        if (img.color_id && String(img.color_id) === String(color.id)) return true;
        if (img.color && (String(img.color) === String(color.id) || String(img.color).toLowerCase() === color.name.toLowerCase())) return true;
        if (img.path) {
          const lowerPath = img.path.toLowerCase();
          if (color.name && lowerPath.includes(color.name.toLowerCase())) return true;
          if (color.id && lowerPath.includes(color.id.toLowerCase())) return true;
        }
        return false;
      });

      if (matchedIndex !== -1) {
        setCurrentImageIndex(matchedIndex);
      } else if (product.colors && product.colors.length > 0) {
        const colorIndex = product.colors.findIndex(c => c.id === color.id);
        if (colorIndex !== -1 && colorIndex < product.images.length) {
          setCurrentImageIndex(colorIndex);
        }
      }
    }
  };

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
      color: selectedColor,
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
          <div className="w-20 h-28 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0 relative">
            <img
              src={product.images?.[currentImageIndex]?.path || product.images?.[0]?.path}
              alt={product.name}
              width={80}
              height={112}
              className="w-full h-full object-cover"
            />
            {isArchived && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="relative w-16 h-16 rounded-full bg-[#eaeaea]/95 flex flex-col items-center justify-center shadow-md">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                    <line x1="58" y1="42" x2="68" y2="28" stroke="#a0a0a0" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="32" y1="72" x2="42" y2="58" stroke="#a0a0a0" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-[#111111] font-medium text-[10px] select-none z-10 text-center px-1">
                    {t('sold_out')}
                  </span>
                </div>
              </div>
            )}
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
          {/* colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-col gap-4">
              <span>{t('color')}: {selectedColor?.name}</span>
              <div className="flex gap-2">
                {product.colors.map((color: Color) => (
                  <div
                    key={color.id}
                    onClick={() => handleColorSelect(color)}
                    className={`relative w-8 h-8 ${isArchived ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    title={color.name}
                  >
                    <div className={`${filterStyles.filter_color_ring} ${selectedColor?.id === color.id ? 'border-2' : ''}`} />
                    <div
                      style={{ backgroundColor: color.code }}
                      className={`${filterStyles.filter_color_circle} relative overflow-hidden`}
                    >
                      {selectedColor?.id === color.id && !isArchived && (
                        <Check size={15} className={isLightColor(color) ? "text-black" : "text-white"} />
                      )}
                      {isArchived && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-[120%] h-[1.5px] bg-white/90 rotate-45 shadow-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    isArchived={isArchived}
                    onClick={() => setSelectedSize(size)}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Quantity */}
          <div className="flex flex-col gap-4">
            <span>{t('quantity')}</span>
            <QuantityChanger quantity={quantity} setQuantity={setQuantity} className={isArchived ? "opacity-50 pointer-events-none" : ""} />
          </div>
          {/* Buttons */}
          <ThreeButtons
            quantity={quantity}
            productId={product.id}
            price={price * quantity}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            isArchived={isArchived}
            onClickAddToCart={handleClickAddToCart}
            onCartOpen={onCartOpen}
          />
        </div>
      </motion.div>
    </ModalLayout>
  );
};
