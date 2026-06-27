'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  promoCode: string | null
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; quantity: number }
  | { type: 'APPLY_PROMO'; code: string }
  | { type: 'REMOVE_PROMO' }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState }

const PROMO_CODE = 'DAILY10'
const DISCOUNT = 0.1

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
      return { ...state, items: [...state.items, action.item] }
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
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.code.toUpperCase() }
    case 'REMOVE_PROMO':
      return { ...state, promoCode: null }
    case 'CLEAR':
      return { items: [], promoCode: null }
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  promoCode: string | null
  discountActive: boolean
  itemCount: number
  subtotal: number
  discountAmount: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  applyPromo: (code: string) => boolean
  removePromo: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], promoCode: null })

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dpg-cart')
      if (saved) dispatch({ type: 'HYDRATE', state: JSON.parse(saved) })
    } catch {}
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('dpg-cart', JSON.stringify(state))
    } catch {}
  }, [state])

  const discountActive = state.promoCode === PROMO_CODE
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discountAmount = discountActive ? Math.round(subtotal * DISCOUNT * 100) / 100 : 0
  const total = subtotal - discountAmount
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        promoCode: state.promoCode,
        discountActive,
        itemCount,
        subtotal,
        discountAmount,
        total,
        addItem: (item) => dispatch({ type: 'ADD', item }),
        removeItem: (id) => dispatch({ type: 'REMOVE', id }),
        setQuantity: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
        applyPromo: (code) => {
          if (code.toUpperCase() === PROMO_CODE) {
            dispatch({ type: 'APPLY_PROMO', code })
            return true
          }
          return false
        },
        removePromo: () => dispatch({ type: 'REMOVE_PROMO' }),
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
