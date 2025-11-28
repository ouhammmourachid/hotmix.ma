"use client";
import React from 'react';
import Header from '@/components/header';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { useState, useEffect } from 'react';
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

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode}>) {
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

function MainLayoutContent({ children }: Readonly<{ children: React.ReactNode}>) {
    const [showHeader, setShowHeader] = useState(true);
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const { isCartOpen, setIsCartOpen } = useCartModal();

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            // Show header only when scrolled to top
            if (currentScrollY === 0) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }

            // Show navigation when scrolling up
            if (currentScrollY < lastScrollY) {
                setShowNav(true);
            } else {
                setShowNav(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <>
            <div className={`fixed top-0 left-0 right-0 transition-transform duration-0 z-50 ${
                showHeader ? 'translate-y-0' : '-translate-y-full'
            }`}>
                <Header />
            </div>

            <div className={`fixed top-0 left-0 right-0 transition-transform duration-300 z-40 ${
                showNav ? 'translate-y-0' : '-translate-y-full'
            }`} style={{ top: showHeader ? '40px' : '0' }}>
                <Navigation
                    onCartClick={() => setIsCartOpen(true)}
                    onSearchClick={() => setIsSearchOpen(true)}
                    onMenuClick={() => setIsSideNavOpen(true)}
                />
            </div>

            <div style={{ paddingTop: '104px' }}>
                {children}
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}/>
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)} />
            <SideMenu
                isOpen={isSideNavOpen}
                onClose={() => setIsSideNavOpen(false)}
                onSearchClick={() => setIsSearchOpen(true)} />
            <FilterModal/>
            <Footer />
            <BottomNavigation
                isCartOpen={isCartOpen}
                onCartClick={() => setIsCartOpen(true)}/>
        </>
    )
}
