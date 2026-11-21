"use client";
import React from 'react';
import Header from '@/components/header';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { useState, useEffect, useRef } from 'react';
import SearchModal from '@/components/modal/search-modal';
import CartModal from '@/components/modal/cart-modal';
import BottomNavigation from '@/components/bottom-navigation';
import SideMenu from '@/components/modal/side-menu';
import FilterModal from '@/components/modal/filter-modal';
import { CartProvider } from '@/contexts/cart-context'
import { WishListProvider } from '@/contexts/wishlist-context';
import { FilterProvider } from '@/contexts/filter-context';
import { GridProvider } from '@/contexts/grid-context';
import { CartModalProvider, useCartModal } from '@/contexts/cart-modal-context';

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <CartModalProvider>
            <GridProvider>
                <FilterProvider>
                    <CartProvider>
                        <WishListProvider>
                            <MainLayoutContent>{children}</MainLayoutContent>
                        </WishListProvider>
                    </CartProvider>
                </FilterProvider>
            </GridProvider>
        </CartModalProvider>
    )
}

// Promo bar + nav bar: below this the nav may tuck away while reading
const HIDE_AFTER = 120;
// Ignore tiny scroll jitters (momentum, address-bar resizes)
const SCROLL_DELTA = 6;

function MainLayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
    const [navHidden, setNavHidden] = useState(false);
    const lastScrollY = useRef(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const { isCartOpen, setIsCartOpen } = useCartModal();

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;
            if (Math.abs(delta) < SCROLL_DELTA) return;

            // Scrolling down past the top: get out of the way. Scrolling up: come back.
            setNavHidden(delta > 0 && currentScrollY > HIDE_AFTER);
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', controlNavbar, { passive: true });
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, []);

    return (
        <>
            {/* Promo bar scrolls away naturally */}
            <div className="relative z-50">
                <Header />
            </div>

            {/* One frosted nav bar: sticky, slides away on scroll down and back on scroll up */}
            <div
                className={`sticky top-0 z-40 transition-transform duration-400 ease-apple will-change-transform ${navHidden ? '-translate-y-full' : 'translate-y-0'}`}>
                <Navigation
                    onCartClick={() => setIsCartOpen(true)}
                    onSearchClick={() => setIsSearchOpen(true)}
                    onMenuClick={() => setIsSideNavOpen(true)}
                />
            </div>

            {/* Main Content */}
            <div>
                {children}
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)} />
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)} />
            <SideMenu
                isOpen={isSideNavOpen}
                onClose={() => setIsSideNavOpen(false)}
                onSearchClick={() => setIsSearchOpen(true)} />
            <FilterModal />
            <Footer />
            <BottomNavigation
                onCartClick={() => setIsCartOpen(true)} />
        </>
    )
}
