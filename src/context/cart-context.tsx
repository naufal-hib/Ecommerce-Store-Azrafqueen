"use client"

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  salePrice?: number
  image?: string
  quantity: number
  categoryName?: string
  sku: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemPrice: (item: CartItem) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_CART':
      const loadedItems = action.payload
      return {
        items: loadedItems,
        total: calculateTotal(loadedItems),
        itemCount: calculateItemCount(loadedItems)
      }

    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems)
      }

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      return {
        items: filteredItems,
        total: calculateTotal(filteredItems),
        itemCount: calculateItemCount(filteredItems)
      }

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      }

    default:
      return state
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = item.salePrice || item.price
    return total + (price * item.quantity)
  }, 0)
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('azrafqueen-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: items })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('azrafqueen-cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemPrice = (item: CartItem) => {
    return item.salePrice || item.price
  }

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}