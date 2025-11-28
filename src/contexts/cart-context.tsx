'use client'

import React, { createContext, useContext, useState,useEffect } from 'react'
import CartItem from '@/types/cart-item'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: number) => void
  updateQuantity: (itemId: number, newQuantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  isInitialized: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Only run on client after mount
    const storedItems = localStorage.getItem('cart-items')
    setCartItems(storedItems ? JSON.parse(storedItems) : [])
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart-items', JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => (i.size?.id === item.size?.id && i.product.id === item.product.id))
      if (existingItem) {
        return prev.map(i =>
          i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      // Generate a unique id by finding the max id and adding 1
      const maxId = prev.length > 0 ? Math.max(...prev.map(item => item.id)) : -1
      item.id = maxId + 1
      return [...prev, item]
    })
  }

  const removeFromCart = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const clearCart = () => setCartItems([])

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
