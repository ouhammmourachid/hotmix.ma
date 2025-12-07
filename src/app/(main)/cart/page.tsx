"use client";
import React from 'react';
import EmptyCartPage from '@/components/cart/empty-cart-page';
import ShoppingCart from '@/components/cart/render-cart-items-page';
import { useCart } from '@/contexts/cart-context';

export default function Page() {
  const { cartItems } = useCart()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {cartItems.length === 0 ? (
        <EmptyCartPage />
      ) : (
        <ShoppingCart />
      )}
    </div>
  );
};
