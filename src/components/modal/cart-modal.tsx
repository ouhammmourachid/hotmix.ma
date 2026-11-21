import React from 'react';
import { useRef } from 'react';
import { XButton } from '@/components/small-pieces';
import ModalLayout from '@/components/modal/modal-layout';
import { RenderCartItems } from '@/components/cart/render-cart-items';
import { useCart } from '@/contexts/cart-context'
import styles from '@/styles/modal.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-utils';


export default function CartModal({ isOpen, onClose }: Readonly<{ isOpen: boolean, onClose: () => void }>) {
  const modalRef = useRef(null);
  const { cartItems, removeFromCart, updateQuantity } = useCart()
  const { t } = useTranslation();


  const animationConfig = {
    initial: { x: '100%', opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 1 },
  };

  const transitionConfig = {
    enter: {
      type: "spring" as const,
      stiffness: 380,
      damping: 38,
      duration: 0.5
    },
    exit: {
      duration: 0.3,
      ease: [0.32, 0.72, 0, 1] as const
    }
  };
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalRef={modalRef}
      className={styles.cart_modal}
      modalId="cart-modal"
    >
      <motion.div
        {...animationConfig}
        transition={isOpen ? transitionConfig.enter : transitionConfig.exit}
        ref={modalRef}
        className={styles.cart}>
        {/* Header */}
        <div className={styles.cart_header}>
          <h2 className="text-title-2 font-semibold">{t('cart_modal_title')}</h2>
          <XButton
            onClick={onClose}
            className='top-4' />
        </div>

        <RenderCartItems
          onClose={onClose}
          cartItems={cartItems}
          onRemove={removeFromCart}
          onQuantityChange={updateQuantity} />
      </motion.div>
    </ModalLayout>
  );
};
