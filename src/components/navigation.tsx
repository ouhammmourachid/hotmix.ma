import { Heart, Search, User, Menu, ChevronDown } from 'lucide-react'
import Basket from '@/components/icon/basket'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import styles from '@/styles/main.module.css'
import Link from 'next/link'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

import { useState, useEffect } from 'react'
import LogoutButton from '@/components/auth/LogoutButton';
import HotmixLogo from '@/components/hotmix-logo';

import { useTranslation } from '@/lib/i18n-utils';
import { useApiService } from '@/services/api.service';
import { createCategorySlug } from '@/lib/utils';
import Category from '@/types/category';

const linkClass =
  'text-subhead text-label/80 hover:text-label transition-colors duration-200';

const iconButtonClass =
  'relative w-11 h-11 flex items-center justify-center rounded-full text-label hover:bg-fill transition-[background-color,transform] duration-200 active:scale-95';

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return <span className={styles.nav_span}>{count}</span>;
}

export default function Navigation({
  onCartClick,
  onSearchClick,
  onMenuClick }: Readonly<{
    onCartClick: () => void,
    onSearchClick: () => void,
    onMenuClick: () => void
  }>) {
  const { totalItems } = useCart()
  const { totalWishList } = useWishlist()
  const { t } = useTranslation();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const clickAccount = () => {
    if (window.location.pathname === '/account/') {
      setIsAccountMenuOpen(!isAccountMenuOpen);
    } else {
      window.location.href = '/account/';
    }
  }
  return (
    <nav
      className={styles.nav + " navigation"}>
      <div className="container mx-auto flex items-center justify-between w-full px-2 md:px-6 lg:px-12">
        {/* Mobile menu button - only visible on small screens */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => onMenuClick()}
            aria-label="Menu"
            className={iconButtonClass}>
            <Menu className="w-[22px] h-[22px]" strokeWidth={1.75} />
          </button>
        </div>

        {/* Logo */}
        <Link
          href="/"
          aria-label="Hotmix"
          className={styles.nav_logo}>
          <HotmixLogo className="h-6 lg:h-7 text-greny w-auto" />
        </Link>

        {/* Desktop navigation links */}
        <NavigationMenu.Root className="hidden lg:flex">
          <NavigationMenu.List className="flex gap-8 items-center">
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <a href="/" className={linkClass}>{t('nav_home')}</a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <a href="/products/" className={linkClass}>{t('nav_all_products')}</a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={linkClass + " group flex items-center gap-1 cursor-pointer bg-transparent border-0"}>
                {t('nav_our_collection')}
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 ease-apple group-data-[state=open]:rotate-180" aria-hidden />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="absolute top-10 w-72 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
                <div className="bg-surface-2 rounded-card shadow-float p-2">
                  {categories.map((item, index) => (
                    <NavigationMenu.Link key={index} asChild>
                      <a
                        href={`/collections/${createCategorySlug(item.name)}/`}
                        className="block px-3 py-2.5 rounded-xl text-subhead text-label hover:bg-fill transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <a href="/sale/" className={linkClass}>{t('nav_sale')}</a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Icons */}
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Search"
            onClick={() => onSearchClick()}
            className={iconButtonClass}>
            <Search className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div className='hidden lg:flex'>
            <div className='relative'>
              <button
                type="button"
                aria-label={t('nav_account')}
                onClick={() => clickAccount()}
                className={iconButtonClass}>
                <User className="w-5 h-5" strokeWidth={1.75} />
              </button>
              {isAccountMenuOpen && (
                <div
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="absolute z-50 bg-surface-2 top-12 right-0 p-2 shadow-float rounded-card min-w-[180px]">
                  <Link href="/account" className="block px-3 py-2.5 rounded-xl text-subhead text-label hover:bg-fill transition-colors">
                    {t('nav_account')}
                  </Link>
                  <div className="px-3 py-1">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
            <a
              href="/wishlist/"
              aria-label="Wishlist"
              className={iconButtonClass}>
              <Heart className="w-5 h-5" strokeWidth={1.75} />
              <CountBadge count={totalWishList} />
            </a>
          </div>
          <button
            type="button"
            aria-label="Cart"
            className={iconButtonClass}
            onClick={() => onCartClick()}>
            <Basket className='w-[18px] text-label' />
            <CountBadge count={totalItems} />
          </button>
        </div>
      </div>
    </nav>
  )
}
