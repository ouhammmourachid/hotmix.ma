import { Heart, Search, User, Menu } from 'lucide-react'
import Basket from '@/components/icon/basket'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import styles from '@/styles/main.module.css'
import Link from 'next/link'
import useAuth from "@/hooks/useAuth";
import { useState } from 'react'
import LogoutButton from '@/components/auth/LogoutButton';
import LanguageSwitcher from './language-switcher';
import { useTranslation } from '@/lib/i18n-utils';

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
  const { auth } = useAuth(); // Access authentication state
  const { t } = useTranslation(); // Translation hook
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
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
      <div className="flex items-center justify-between w-full px-4 lg:px-0">
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
        <div className="hidden lg:flex gap-8 text-white justify-center">
          <NavLink href="/" name={t('nav_home')} />
          <NavLink href="/products" name={t('nav_all_products')} />
          <NavLink href="/collections" name={t('nav_collections')} />
          <NavLink href="/new-collection" name={t('nav_new_collection')} />
          <NavLink href="/sale" name={t('nav_sale')} />
        </div>

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
