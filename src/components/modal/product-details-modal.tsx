import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Product from '@/types/product';
import { XButton } from '@/components/small-pieces';
import ModalLayout from '@/components/modal/modal-layout';
import styles from '@/styles/modal.module.css';
import { useTranslation } from '@/lib/i18n-utils';

export default function ProductDetailsModal({ isOpen, onClose, product }: Readonly<{ isOpen: boolean, onClose: () => void, product: Product }>) {
  const modalRef = useRef(null);
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const animationConfig = {
    initial: { x: isRTL ? '-100%' : '100%' },
    animate: { x: 0 },
    exit: { x: isRTL ? '-100%' : '100%' },
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
      className={styles.product_info_modal}
      modalId="product-details-modal"
    >
      <motion.div
        {...animationConfig}
        transition={isOpen ? transitionConfig.enter : transitionConfig.exit}
        ref={modalRef}
        className={`${styles.product_info} ${isRTL ? 'left-0' : 'right-0'}`}>
        <div className={styles.product_info_header}>
          <h2 className={styles.product_info_title}>{t('product_tab_details')}</h2>
          <XButton
            onClick={onClose}
            className='top-5' />
        </div>
        <div className={`${styles.product_info_body} space-y-10`}>
          {product.sizes && product.sizes.length > 0 && (
            <section>
              <h3 className={styles.product_info_heading}>{t('filter_sizes')}</h3>
              <ul className={styles.product_info_sizes}>
                {product.sizes.map((size) => (
                  <li key={size.id} className={styles.product_info_size}>{size.name}</li>
                ))}
              </ul>
            </section>
          )}
          {product.colors && product.colors.length > 0 && (
            <section>
              <h3 className={styles.product_info_heading}>{t('filter_colors')}</h3>
              <ul className="space-y-3 text-gray-200">
                {product.colors.map((color) => (
                  <li key={color.id} className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-white/40"
                      style={{ backgroundColor: color.code }}
                    />
                    {color.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </motion.div>
    </ModalLayout>
  );
}
