"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer, removeFromCart, updateQty } from "@/store/cartSlice";
import { useCartItems, useCartTotals } from "@/hooks/useCart";
import { formatPrice, salePrice } from "@/lib/format";
import { FREE_SHIPPING_OVER } from "@/data/coupons";
import { CloseIcon, TrashIcon, CartIcon } from "./Icons";
import QtySelect from "./QtySelect";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.cart.drawerOpen);
  const items = useCartItems();
  const { subtotal } = useCartTotals();
  const remaining = FREE_SHIPPING_OVER - subtotal;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => dispatch(closeDrawer())} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button onClick={() => dispatch(closeDrawer())} className="rounded-full p-1.5 hover:bg-gray-100">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <CartIcon className="h-10 w-10 text-gray-300" />
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-muted">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/products" onClick={() => dispatch(closeDrawer())} className="btn-primary mt-2">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-brand-50 px-5 py-3 text-sm text-brand-900">
              {remaining > 0 ? (
                <>
                  You&apos;re <strong>{formatPrice(remaining)}</strong> away from free shipping
                </>
              ) : (
                <>You&apos;ve unlocked free shipping 🎉</>
              )}
            </div>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <img src={item.thumbnail} alt={item.title} className="h-20 w-20 rounded-lg bg-gray-100 object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/product?id=${item.id}`}
                        onClick={() => dispatch(closeDrawer())}
                        className="text-sm font-medium hover:text-brand-600"
                      >
                        {item.title}
                      </Link>
                      <span className="text-sm font-semibold">{formatPrice(salePrice(item) * item.qty)}</span>
                    </div>
                    <span className="text-xs text-muted">{item.brand}</span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtySelect
                        value={item.qty}
                        max={item.stock}
                        onChange={(qty) => dispatch(updateQty({ id: item.id, qty }))}
                      />
                      <button onClick={() => dispatch(removeFromCart(item.id))} className="text-gray-400 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={() => dispatch(closeDrawer())} className="btn-outline">
                  View cart
                </Link>
                <Link href="/checkout" onClick={() => dispatch(closeDrawer())} className="btn-primary">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
