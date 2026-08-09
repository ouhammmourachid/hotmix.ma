import React,{useState,useEffect} from 'react';
import { Button } from '@/components/ui/button';
import { QuantityChanger } from '@/components/small-pieces';
import Product from '@/types/product';
import styles from '@/styles/product.module.css';
import { useTranslation } from '@/lib/i18n-utils';
import { formatPrice } from '@/lib/utils';

export default function StickyProductFooter({                                  product,
                                  quantity,
                                  setQuantity,
                                  onClickAddToCart,
                                  onCartOpen
                                }:{
                                  product:Product
                                  quantity:number
                                  setQuantity:React.Dispatch<React.SetStateAction<number>>,
                                  onClickAddToCart:()=>any,
                                  onCartOpen?:()=>void
                                }) {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
      // Create a ref for the buy now button
      const buyNowButton = document.querySelector('[data-button-tracker]');

      if (!buyNowButton) return;

      // Create the intersection observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          // When button is visible (entry.isIntersecting is true),
          // we want to hide the footer (setIsVisible(false))
          setIsVisible(!entry.isIntersecting);
        },
        {
          // Adjust these options as needed
          threshold: 0,
          rootMargin: '0px'
        }
      );

      // Start observing the button
      observer.observe(buyNowButton);

      // Cleanup
      return () => {
        observer.disconnect();
      };
  }, []);

    const isArchived = product.status === "archived" || Boolean((product as any).is_archived) || Boolean((product as any).isArchived);
    const { language } = useTranslation();

    if (!isVisible) return null;
    return (
      <div className={styles.sticky_product_footer + " sticky-product-footer"}>
        <div className='items-center gap-4 hidden md:flex'>
          <img
            src={product.images[0].path}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-full"
          />
          <span className={styles.sticky_product_footer_name}>
            {product.name}
          </span>
        </div>
        <div className='flex items-center justify-between sm:justify-center gap-2 md:gap-4 w-full md:w-fit'>
          <QuantityChanger
            quantity={quantity}
            setQuantity={setQuantity}
            className={`sticky-footer mb-0 shrink-0 ${isArchived ? 'opacity-50 pointer-events-none' : ''}`} 
          />
          <Button
            disabled={isArchived}
            onClick={() => {
              if (!isArchived) {
                onClickAddToCart();
                onCartOpen?.();
              }
            }}
            className={`${styles.sticky_product_footer_button} text-xs sm:text-base flex-1 sm:flex-initial min-w-0 ${
              isArchived ? 'bg-[#526365]/90 border-[#607375] text-white/90 cursor-not-allowed hover:bg-[#526365]/90' : ''
            }`}>
            {isArchived
              ? `${t('sold_out')} - ${formatPrice(product.sale_price || product.price, 'DH', language)}`
              : t('add_to_cart')}
          </Button>
        </div>
      </div>
    );
  };
