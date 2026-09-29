"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQty, applyCoupon, removeCoupon } from "@/store/cartSlice";
import { showToast } from "@/store/toastSlice";
import { useCartItems, useCartTotals } from "@/hooks/useCart";
import { formatPrice, salePrice } from "@/lib/format";
import { findCoupon } from "@/lib/cart";
import { CartIcon, TrashIcon } from "@/components/Icons";
import QtySelect from "@/components/QtySelect";

export default function CartClient() {
  const dispatch = useDispatch();
  const items = useCartItems();
  const coupon = useSelector((state) => state.cart.coupon);
  const totals = useCartTotals();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleApply(e) {
    e.preventDefault();
    setError("");
    const result = findCoupon(code);
    if (result.error) {
      setError(result.error);
      return;
    }
    dispatch(applyCoupon(result.coupon));
    dispatch(showToast(`${result.coupon.code} applied`));
    setCode("");
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-card">
          <CartIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted">Add a couple of products and they&apos;ll show up here.</p>
          <Link href="/products" className="btn-primary mt-6 inline-flex">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">Shopping cart</h1>
      <p className="mt-1 text-sm text-muted">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-xl bg-white p-4 shadow-card">
              <img src={item.thumbnail} alt={item.title} className="h-24 w-24 rounded-lg bg-gray-100 object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">{item.brand}</p>
                    <Link href={`/product?id=${item.id}`} className="font-semibold hover:text-brand-600">{item.title}</Link>
                  </div>
                  <p className="text-base font-bold">{formatPrice(salePrice(item) * item.qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QtySelect value={item.qty} max={item.stock} onChange={(qty) => dispatch(updateQty({ id: item.id, qty }))} />
                  <button onClick={() => dispatch(removeFromCart(item.id))} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600">
                    <TrashIcon className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl bg-white p-6 shadow-card">
          <p className="text-lg font-semibold">Order summary</p>

          <form onSubmit={handleApply} className="mt-4">
            <label className="label">Coupon code</label>
            <div className="flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SAVE10" className="input" />
              <button type="submit" className="btn-outline">Apply</button>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {coupon && (
              <p className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <span>{coupon.code} · {coupon.label}</span>
                <button onClick={() => dispatch(removeCoupon())} className="text-emerald-800 hover:underline">remove</button>
              </p>
            )}
          </form>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>-{formatPrice(totals.discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
          </dl>

          <Link href="/checkout" className="btn-primary mt-5 w-full">Checkout</Link>
          <Link href="/products" className="btn-outline mt-2 w-full">Keep shopping</Link>
        </aside>
      </div>
    </div>
  );
}
