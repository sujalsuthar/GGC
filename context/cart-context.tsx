"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { GlassProduct } from "@/lib/glass-data"
import type { Dimensions } from "@/lib/price-calculator"
import { useToast } from "@/components/ui/use-toast"

export interface CartItem {
  id: string
  name: string
  price: number
  dimensions: Dimensions
  quantity: number
  product: GlassProduct
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + item.price, 0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if item with same product and dimensions already exists
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.dimensions.width === newItem.dimensions.width &&
          item.dimensions.height === newItem.dimensions.height &&
          item.dimensions.unit === newItem.dimensions.unit,
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        const newQuantity = existingItem.quantity + newItem.quantity

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          price: (existingItem.price / existingItem.quantity) * newQuantity,
        }

        toast({
          title: "Cart updated",
          description: `Updated quantity of ${newItem.name} in cart.`,
        })

        return updatedItems
      } else {
        // Add new item
        toast({
          title: "Added to cart",
          description: `${newItem.name} has been added to your cart.`,
        })

        return [...prevItems, newItem]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id)

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })

      return updatedItems
    })
  }

  // Update quantity of item in cart
  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          const unitPrice = item.price / item.quantity
          return {
            ...item,
            quantity,
            price: unitPrice * quantity,
          }
        }
        return item
      })
    })
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
