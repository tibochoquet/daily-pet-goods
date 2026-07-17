'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  variantLabel: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState }

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'SET_QTY':
      if (action.quantity < 1)
        return { ...state, items: state.items.filter((i) => i.id !== action.id) }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dpg-cart')
      if (saved) dispatch({ type: 'HYDRATE', state: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('dpg-cart', JSON.stringify(state))
    } catch {}
  }, [state])

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        subtotal,
        addItem: (item) => dispatch({ type: 'ADD', item }),
        removeItem: (id) => dispatch({ type: 'REMOVE', id }),
        setQuantity: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
