import React, { useState } from 'react';

import ProductReviews from '@/components/product/product-reviews';
import Product from '@/types/product';
import styles from '@/styles/product.module.css';
import { useTranslation } from '@/lib/i18n-utils';

const tabs = [
  { id: 'description', translationKey: 'product_tab_description' },
  { id: 'details', translationKey: 'product_tab_details' },
  { id: 'reviews', translationKey: 'product_tab_reviews' }
];

export default function ProductDetails({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('description');
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const renderContent = (product: Product) => {
    switch (activeTab) {
      case 'description':
        return (
          <div
            className="p-6 space-y-4 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        );
      case 'details':
        return (
          <div className="p-4 sm:p-6 font-semibold">
            <div className="rounded-lg border border-secondary">
              <div className="flex items-center justify-between">
                <div className="p-3 w-1/3">
                  <span className="text-base font-medium text-gray-200">{t('size')}</span>
                </div>
                <div className="border-l border-secondary p-3 w-full">
                  <span className="text-base text-gray-300">
                    {product.sizes?.map((size) => size.name).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <ProductReviews reviews={[]} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.product_details}>
      <div className="flex flex-row lg:flex-col items-start gap-6 lg:gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} className={`lg:px-6 py-4 text-lg font-semibold relative
                ${isRTL
                ? 'lg:border-r-2 lg:border-l-0'
                : 'lg:border-l-2 lg:border-r-0'
              } lg:border-b-0 border-secondary
                hover:text-greny ${activeTab === tab.id
                ? 'border-white border-b-2'
                : ''
              }`}
          >
            {t(tab.translationKey)}
          </button>
        ))}
      </div>
      <div className={styles.product_details_content}>
        {renderContent(product)}
      </div>
    </div>
  );
};
