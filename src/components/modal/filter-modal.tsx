import React, { useRef } from 'react';
import Filter from '@/components/icon/filter';
import ModalLayout from '@/components/modal/modal-layout';
import { XButton } from '@/components/small-pieces';
import { useFilter } from '@/contexts/filter-context';
import { FilterFeature } from '@/components/small-pieces';
import ColorFilter from '@/components/filters/color';
import TagFilter from '@/components/filters/tag';
import SizeFilter from '@/components/filters/size';
import CategoryFilter from '@/components/filters/category';
import { ScrollArea } from '@/components/ui/scroll-area';
import styles from '@/styles/modal.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-utils';

export default function FilterModal() {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const { isFilterOpen, setIsFilterOpen } = useFilter();
  const onClose = () => setIsFilterOpen(false);
  const animationConfig = {
    initial: { x: -1000, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -1000, opacity: 0 },
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
      isOpen={isFilterOpen}
      onClose={onClose}
      modalRef={modalRef}
      modalId="filter-modal"
      className={styles.filter_modal}>
      <motion.div
        {...animationConfig}
        transition={isFilterOpen ? transitionConfig.enter : transitionConfig.exit}
        ref={modalRef}
        className={styles.filter}>
        <XButton
          className=""
          onClick={onClose} />
        <div className={styles.filter_header}>
          <Filter /> {t('filter')}
        </div>
        <ScrollArea className='flex-1 p-4'>
          <FilterFeature title={t('filter_colors')}>
            <ColorFilter onClick={onClose} />
          </FilterFeature>
          <FilterFeature title={t('filter_tags')}>
            <TagFilter onClick={onClose} />
          </FilterFeature>
          <FilterFeature title={t('filter_sizes')}>
            <SizeFilter onClick={onClose} />
          </FilterFeature>
          <FilterFeature title={t('filter_categories')}>
            <CategoryFilter onClick={onClose} />
          </FilterFeature>
        </ScrollArea>
      </motion.div>
    </ModalLayout>
  );
}
