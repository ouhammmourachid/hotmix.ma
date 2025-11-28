"use client";
import React from 'react';
import RenderWishList from '@/components/wishlist/render-wishlist';
import { useWishlist } from '@/contexts/wishlist-context';
import emptyWishList from '@/components/wishlist/empty-wishlist';

export default function Page(){
  const { totalWishList } = useWishlist();
  if (!totalWishList) {
    return emptyWishList();
  }
  return (
    <div>
      <RenderWishList />
    </div>
  );
};
