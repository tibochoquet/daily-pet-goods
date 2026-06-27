'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'

export default function CartPage() {
  const { items, subtotal, total, discountAmount, discountActive, promoCode, removeItem, setQuantity } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-[#C8B89A] mb-6" />
        <h1 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-3">
          Your cart is empty
        </h1>
        <p className="text-[#6B7280] mb-8">
          Add some products to get started.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3D6456] transition-colors"
        >
          <ShoppingBag size={16} />
          Shop now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white border border-[#E8E2D9] rounded-2xl p-4"
            >
              <Link href={`/products/${item.id}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F3EDE3]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-medium text-[#1A1A1A] text-sm leading-snug hover:text-[#2C4A3E] transition-colors line-clamp-2 mb-1">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-[#2C4A3E] font-semibold text-sm mb-3">
                  €{item.price.toFixed(2)}
                </p>

                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#E8E2D9] rounded-full overflow-hidden">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F3EDE3] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-[#1A1A1A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F3EDE3] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#C8745A] hover:text-[#A85E45] transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sticky top-24">
            <h2 className="font-serif font-semibold text-[#1A1A1A] text-lg mb-5">
              Order summary
            </h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              {discountActive && (
                <div className="flex justify-between text-[#2C4A3E]">
                  <span>Discount ({promoCode})</span>
                  <span>−€{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B7280]">
                <span>Shipping</span>
                <span className="text-[#2C4A3E] font-medium">Free</span>
              </div>
              <div className="border-t border-[#E8E2D9] pt-3 flex justify-between font-semibold text-[#1A1A1A] text-base">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {!discountActive && (
              <p className="text-xs text-[#6B7280] bg-[#F3EDE3] rounded-lg px-3 py-2 mb-5">
                Have a promo code? Apply it at checkout.
              </p>
            )}

            <Link
              href="/checkout"
              className="block w-full text-center bg-[#C8745A] text-white font-semibold py-3.5 rounded-full hover:bg-[#A85E45] transition-colors"
            >
              Checkout
            </Link>
            <Link
              href="/shop"
              className="block w-full text-center text-sm text-[#6B7280] hover:text-[#2C4A3E] transition-colors mt-3"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
