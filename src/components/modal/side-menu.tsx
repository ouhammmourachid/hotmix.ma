import React, { useRef, useState, useEffect } from 'react';
import { Heart, Search, User, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ModalLayout from '@/components/modal/modal-layout';
import { XButton } from '@/components/small-pieces';
import styles from '@/styles/modal.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-utils';
import { useApiService } from '@/services/api.service';
import Category from '@/types/category';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SideMenu({ isOpen, onClose, onSearchClick }: Readonly<{ isOpen: boolean, onClose: () => void, onSearchClick?: () => void }>) {
  const modalRef = useRef(null);
  const { t } = useTranslation();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const api = useApiService();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.category.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsCollectionOpen(false);
    }
  }, [isOpen]);

  const menuItems = [
    { label: t('nav_home'), href: '/' },
    { label: t('nav_all_products'), href: '/products' },
    // Removed old static collection links
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
            {/* Standard Items */}
            <li>
              <Link
                onClick={onClose}
                href={"/"}
                className={styles.side_menu_link}>
                {t('nav_home')}
              </Link>
            </li>
            <li>
              <Link
                onClick={onClose}
                href={"/products"}
                className={styles.side_menu_link}>
                {t('nav_all_products')}
              </Link>
            </li>

            {/* Our Collection Dropdown */}
            <li className="border-b border-secondary">
              <div
                className="flex justify-between items-center cursor-pointer text-white text-sm hover:text-gray-300 pb-3"
                onClick={() => setIsCollectionOpen(!isCollectionOpen)}
              >
                <span>Our Collection</span>
                {isCollectionOpen ? <Minus size={20} /> : <Plus size={20} />}
              </div>
              <AnimatePresence>
                {isCollectionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ScrollArea className="h-[40vh] mt-2 mb-3">
                      <ul className="ml-2 pl-4 border-l border-secondary space-y-4 py-2">
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              onClick={onClose}
                              href={`/collections/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className="block text-whity hover:text-greny transition-colors"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li>
              <Link
                onClick={onClose}
                href={"/sale"}
                className={styles.side_menu_link}>
                {t('nav_sale')}
              </Link>
            </li>
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
            <span className='text-sm'>{t('currency_code')}</span>
          </div>
        </div>
      </motion.div>
    </ModalLayout>
  );
};
