import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import Product from '@/types/product';
import ProductDescriptionModal from '@/components/modal/product-description-modal';
import ProductDetailsModal from '@/components/modal/product-details-modal';
import styles from '@/styles/product.module.css';
import { useTranslation } from '@/lib/i18n-utils';

type SectionId = 'description' | 'details';

const sections: { id: SectionId; translationKey: string }[] = [
  { id: 'description', translationKey: 'product_tab_description' },
  { id: 'details', translationKey: 'product_tab_details' }
];

export default function ProductDetails({ product }: { product: Product }) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const { t } = useTranslation();

  const onClose = () => setActiveSection(null);

  return (
    <div className={styles.product_details}>
      <ul className={styles.product_details_list}>
        {sections.map((section) => (
          <li key={section.id} className={styles.product_details_row}>
            <button
              onClick={() => setActiveSection(section.id)}
              className={styles.product_details_button}
            >
              {t(section.translationKey)}
              <ArrowRight className={styles.product_details_icon} />
            </button>
          </li>
        ))}
      </ul>

      <ProductDescriptionModal
        isOpen={activeSection === 'description'}
        onClose={onClose}
        description={product.description} />
      <ProductDetailsModal
        isOpen={activeSection === 'details'}
        onClose={onClose}
        product={product} />
    </div>
  );
};
