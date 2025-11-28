'use client'

import React, { createContext, useContext, useState,useEffect } from 'react'

interface WishListContextType {
  wishListItems: number[]
  addToWithList: (id:number) => void
  removeFromWithList: (id: number) => void
  isInWithList: (id: number) => boolean
  totalWishList: number
  isInitialized: boolean
}

const WishListContext = createContext<WishListContextType | undefined>(undefined)

export function WishListProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [wishListItems, setWishListItems] = useState<number[]>([])

  useEffect(() => {
    // Only run on client after mount
    const storedItems = localStorage.getItem('wishlist-items')
    setWishListItems(storedItems ? JSON.parse(storedItems) : [])
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('wishlist-items', JSON.stringify(wishListItems))
    }
  }, [wishListItems, isInitialized])

  const addToWithList = (id: number) => {
    setWishListItems(prev => {
      const existingItem = prev.find(i => i === id)
      if (existingItem) {
        return prev
      }
      return [...prev, id]
    })
  }
  const removeFromWithList = (id: number) => {
    setWishListItems(prev => prev.filter(item => item !== id))
  }
  const isInWithList = (id: number) => wishListItems.includes(id)
  const totalWishList = wishListItems.length

  return (
    <WishListContext.Provider
      value={{
        wishListItems,
        addToWithList,
        removeFromWithList,
        isInWithList,
        totalWishList,
        isInitialized,
      }}
    >
      {children}
    </WishListContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishListContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishListProvider')
  }
  return context
}
