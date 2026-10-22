import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

import Product from '@/types/product';
import ModalLayout from '@/components/modal/modal-layout';
import styles from '@/styles/product.module.css';
import { useTranslation } from '@/lib/i18n-utils';

type SectionId = 'description' | 'details';

const sections: { id: SectionId; translationKey: string }[] = [
  { id: 'description', translationKey: 'product_tab_description' },
  { id: 'details', translationKey: 'product_tab_details' }
];

export default function ProductDetails({ product }: { product: Product }) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  // Keeps the last opened section rendered while the panel animates out
  const [displayedSection, setDisplayedSection] = useState<SectionId>('description');
  const panelRef = useRef(null);
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const openSection = (id: SectionId) => {
    setDisplayedSection(id);
    setActiveSection(id);
  };
  const closePanel = () => setActiveSection(null);

  const title = t(sections.find((section) => section.id === displayedSection)!.translationKey);

  const renderContent = () => {
    switch (displayedSection) {
      case 'description':
        return (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        );
      case 'details':
        return (
          <div className="space-y-10">
            {product.sizes && product.sizes.length > 0 && (
              <section>
                <h3 className={styles.product_info_heading}>{t('filter_sizes')}</h3>
                <ul className="space-y-1 text-gray-200">
                  {product.sizes.map((size) => (
                    <li key={size.id}>{size.name}</li>
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
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.product_details}>
      <ul className="w-full">
        {sections.map((section) => (
          <li key={section.id} className="border-b border-secondary">
            <button
              onClick={() => openSection(section.id)}
              className="w-full flex items-center justify-between py-6 text-sm font-bold uppercase tracking-wide hover:text-greny transition-colors"
            >
              {t(section.translationKey)}
              <ArrowRight className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </li>
        ))}
      </ul>

      <ModalLayout
        isOpen={activeSection !== null}
        onClose={closePanel}
        modalRef={panelRef}
        className="fixed inset-0 bg-black/50 z-50"
        modalId="product-info"
      >
        <motion.div
          ref={panelRef}
          initial={{ x: isRTL ? '-100%' : '100%' }}
          animate={{ x: 0 }}
          exit={{ x: isRTL ? '-100%' : '100%' }}
          transition={{ type: 'tween', duration: 0.35 }}
          className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full md:max-w-xl bg-primary text-white shadow-lg flex flex-col`}
        >
          <div className="relative flex items-center justify-center px-14 py-5 border-b border-secondary">
            <button
              onClick={closePanel}
              aria-label="Back"
              className={`md:hidden absolute ${isRTL ? 'right-4' : 'left-4'}`}
            >
              <ArrowLeft className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-wide text-center">{title}</h2>
            <button
              onClick={closePanel}
              aria-label="Close"
              className={`hidden md:block absolute ${isRTL ? 'left-4' : 'right-4'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-8">
            {renderContent()}
          </div>
        </motion.div>
      </ModalLayout>
    </div>
  );
};
