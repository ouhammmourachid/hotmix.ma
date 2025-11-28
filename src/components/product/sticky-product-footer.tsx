import React,{useState,useEffect} from 'react';
import { Button } from '@/components/ui/button';
import { QuantityChanger } from '@/components/small-pieces';
import Product from '@/types/product';
import styles from '@/styles/product.module.css';
import { useTranslation } from '@/lib/i18n-utils';

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
        <div className='flex items-center justify-center gap-2 md:gap-4 w-full md:w-fit'>        <QuantityChanger
            quantity={quantity}
            setQuantity={setQuantity}
            className="sticky-footer mb-0" 
            />        <Button
          onClick={() => {
            onClickAddToCart();
            onCartOpen?.();
          }}
          className={styles.sticky_product_footer_button}>
          {t('add_to_cart')}
        </Button>
      </div>
    </div>
  );
};
