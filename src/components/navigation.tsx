import { Heart, Search, User, Menu, ChevronDown } from 'lucide-react'
import Basket from '@/components/icon/basket'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import styles from '@/styles/main.module.css'
import Link from 'next/link'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

import { useState, useEffect } from 'react'
import LogoutButton from '@/components/auth/LogoutButton';

import { useTranslation } from '@/lib/i18n-utils';
import { useApiService } from '@/services/api.service';
import Category from '@/types/category';

function NavLink({
  href,
  name
}: {
  href: string,
  name: string
}) {
  return (
    <a href={href} className={styles.nav_link + " group"}>
      {name}
      <div className='absolute group-hover:left-0 bottom-0 right-0 h-0.5 bg-whity w-0 transition-all duration-400 ease-in-out  group-hover:w-full' />
    </a>
  )
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
  // const { auth } = useAuth(); // Access authentication state
  const { t } = useTranslation(); // Translation hook
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
    if (window.location.pathname === '/account') {
      setIsAccountMenuOpen(!isAccountMenuOpen);
    } else {
      window.location.href = '/account';
    }
  }
  return (
    <nav
      className={styles.nav + " navigation"}>
      <div className="container mx-auto flex items-center justify-between w-full px-4 md:px-6 lg:px-12">
        {/* Mobile menu button - only visible on small screens */}
        <div className="flex items-center lg:hidden">
          <Menu
            onClick={() => onMenuClick()}
            className="text-white cursor-pointer" />
        </div>

        {/* Logo - left aligned on large screens */}
        <Link
          href="/"
          className={styles.nav_logo}>
          HOTMIX
        </Link>            {/* Desktop navigation links - centered on large screens */}
        <NavigationMenu.Root className="hidden lg:flex">
          <NavigationMenu.List className="flex gap-8 text-white items-center">
            {/* Home Link */}
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <a href="/" className={styles.nav_link + " group"}>
                  {t('nav_home')}
                  <div className='absolute group-hover:left-0 bottom-0 right-0 h-0.5 bg-whity w-0 transition-all duration-400 ease-in-out group-hover:w-full' />
                </a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            {/* All Products Link */}
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <a href="/products" className={styles.nav_link + " group"}>
                  {t('nav_all_products')}
                  <div className='absolute group-hover:left-0 bottom-0 right-0 h-0.5 bg-whity w-0 transition-all duration-400 ease-in-out group-hover:w-full' />
                </a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            {/* Winter Collection Dropdown */}
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={styles.nav_link + " group flex items-center gap-1 cursor-pointer bg-transparent border-0 text-white"}>
                Our Collection
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden />
                <div className='absolute group-hover:left-0 bottom-0 right-0 h-0.5 bg-whity w-0 transition-all duration-400 ease-in-out group-hover:w-full' />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="absolute top-11 w-72 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2">
                <div className="bg-primary shadow-lg  py-4 px-6 ">
                  {categories.map((item, index) => (
                    <NavigationMenu.Link key={index} asChild>
                      <a
                        href={`/products?category=${item.id}`}
                        className="block py-2 text-white hover:text-greny transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>



            {/* Sale Link */}
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <a href="/sale" className={styles.nav_link + " group"}>
                  {t('nav_sale')}
                  <div className='absolute group-hover:left-0 bottom-0 right-0 h-0.5 bg-whity w-0 transition-all duration-400 ease-in-out group-hover:w-full' />
                </a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Right section with icons */}
        <div className="flex items-center gap-4">
          <Search
            className="w-5 h-5 cursor-pointer hover:text-greny text-white"
            onClick={() => onSearchClick()} />
          <div className='hidden lg:flex gap-4'>
            <div
              className='relative'>
              <User
                onClick={() => clickAccount()}
                className="w-5 h-5 hover:text-greny cursor-pointer text-white" />                  {isAccountMenuOpen && (
                  <div
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="absolute z-50 bg-secondary top-8 right-0 p-4 pt-2 shadow-lg rounded-md min-w-[150px]">
                    <Link href="/account" className="block py-2 text-white">
                      {t('nav_account')}
                    </Link>
                    <div>
                      <LogoutButton />
                    </div>
                  </div>
                )}
            </div>
            <a
              href="/wishlist"
              className="relative cursor-pointer hover:text-greny">
              <Heart className="w-5 h-5 text-white" />
              <span className={styles.nav_span}>
                {totalWishList}
              </span>
            </a>
          </div>
          <div
            className="relative cursor-pointer hover:text-greny"
            onClick={() => onCartClick()}>
            <Basket className='w-4 sm:w-4 text-white' />
            <span
              className={styles.nav_span + " scale-75 sm:scale-100"}>
              {totalItems}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}
