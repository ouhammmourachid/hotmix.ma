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

const HEADER_HEIGHT = 40;

function MainLayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
    const [showFixedNav, setShowFixedNav] = useState(false);
    const lastScrollY = useRef(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const { isCartOpen, setIsCartOpen } = useCartModal();

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            const isScrollingUp = currentScrollY < lastScrollY.current;

            // Show fixed nav ONLY if we are scrolled past the header AND scrolling up
            if (currentScrollY > HEADER_HEIGHT && isScrollingUp) {
                setShowFixedNav(true);
            } else {
                setShowFixedNav(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', controlNavbar);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, []);

    return (
        <>
            {/* Header: Relative positioning so it scrolls away naturally */}
            <div className="relative z-50">
                <Header />
            </div>

            {/* Original Navigation: Relative, scrolls away naturally */}
            <div className="relative z-40">
                <Navigation
                    onCartClick={() => setIsCartOpen(true)}
                    onSearchClick={() => setIsSearchOpen(true)}
                    onMenuClick={() => setIsSideNavOpen(true)}
                />
            </div>

            {/* Fixed Navigation: Slides in when scrolling up past header */}
            <div className={`fixed top-0 left-0 right-0 transition-transform duration-300 z-50 ${showFixedNav ? 'translate-y-0' : '-translate-y-full'
                }`}>
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
