"use client";
import React, { createContext, useContext, useState } from 'react';

interface CartModalContextType {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartModalContext = createContext<CartModalContextType | undefined>(undefined);

export const CartModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartModalContext.Provider value={{
      isCartOpen,
      setIsCartOpen,
      openCart,
      closeCart,
    }}>
      {children}
    </CartModalContext.Provider>
  );
};

export const useCartModal = (): CartModalContextType => {
  const context = useContext(CartModalContext);
  if (context === undefined) {
    throw new Error('useCartModal must be used within a CartModalProvider');
  }
  return context;
};
