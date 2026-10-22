import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { XButton } from '@/components/small-pieces';
import ModalLayout from '@/components/modal/modal-layout';
import styles from '@/styles/modal.module.css';
import { useTranslation } from '@/lib/i18n-utils';

export default function ProductDescriptionModal({ isOpen, onClose, description }: Readonly<{ isOpen: boolean, onClose: () => void, description: string }>) {
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
      modalId="product-description-modal"
    >
      <motion.div
        {...animationConfig}
        transition={isOpen ? transitionConfig.enter : transitionConfig.exit}
        ref={modalRef}
        className={`${styles.product_info} ${isRTL ? 'left-0' : 'right-0'}`}>
        <div className={styles.product_info_header}>
          <h2 className={styles.product_info_title}>{t('product_tab_description')}</h2>
          <XButton
            onClick={onClose}
            className='top-5' />
        </div>
        <div className={styles.product_info_body}>
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </motion.div>
    </ModalLayout>
  );
}
