import React, { useRef, useState } from 'react';
import { Heart, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ModalLayout from '@/components/modal/modal-layout';
import { XButton } from '@/components/small-pieces';
import styles from '@/styles/modal.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-utils';
import { useWishlist } from '@/contexts/wishlist-context';

export default function SideMenu({ isOpen, onClose, onSearchClick }: Readonly<{ isOpen: boolean, onClose: () => void, onSearchClick?: () => void }>) {
    const modalRef = useRef(null);
    const { t } = useTranslation();
    const router = useRouter();
    const { totalWishList } = useWishlist();
  
  const menuItems = [
    { label: t('nav_home'), href: '/' },
    { label: t('nav_all_products'), href: '/products' },
    { label: t('nav_collections'), href: '/collections' },
    { label: t('nav_new_collection'), href: '/new-collection' },
    { label: t('nav_sale'), href: '/sale' },
  ];
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
        isOpen={isOpen}
        onClose={onClose}
        modalRef={modalRef}
        modalId="side-menu-modal"
        className={styles.side_menu_modal}>
        <motion.div
          {...animationConfig}
          transition={isOpen ? transitionConfig.enter : transitionConfig.exit}
          ref={modalRef}
        className={styles.side_menu}>
          <XButton
            onClick={onClose} />

          <nav className="mt-16">
            <ul className="space-y-4 text-secondary">
              {menuItems.map((item) => (
                <li key={item.label}>
                  {/* change the border for the last item */}
                  <Link
                    onClick={onClose}
                    href={item.href}
                    className={styles.side_menu_link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 text-sm flex flex-row gap-3">
            <button 
              onClick={() => {
                router.push('/wishlist');
                onClose();
              }}
              className={styles.side_menu_button}>
              <Heart size={16} />
              <span>{t('side_menu_wishlist')}</span>
            </button>

            <button 
              onClick={() => {
                onSearchClick?.();
                onClose();
              }}
              className={styles.side_menu_button}>
              <Search size={16} />
              <span>{t('side_menu_search')}</span>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 space-y-4 ">
            <button 
              onClick={() => {
                router.push('/account');
                onClose();
              }}
              className={styles.side_menu_account_button}>
              <User size={20} />
              <span>{t('side_menu_account')}</span>
            </button>
            <div className="items-center py-4 gap-2 flex justify-start border-t-2 border-secondary">
              <span>
                <img src="https://flagcdn.com/w20/ma.png" alt="Morocco" />
              </span>
              <span className='text-sm '>{t('currency_code')}</span>
            </div>
          </div>
        </motion.div>
      </ModalLayout>
  );
};
