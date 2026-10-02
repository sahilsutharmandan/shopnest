"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, openDrawer } from "@/store/cartSlice";
import { toggleWishlist } from "@/store/wishlistSlice";
import { showToast } from "@/store/toastSlice";
import { formatPrice, salePrice } from "@/lib/format";
import { HeartIcon } from "./Icons";
import Rating from "./Rating";

export default function ProductCard({ product, view = "grid" }) {
  const dispatch = useDispatch();
  const isWished = useSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id),
  );

  function handleAdd() {
    if (product.stock <= 0) return;
    dispatch(addToCart({ product, qty: 1 }));
    dispatch(openDrawer());
    dispatch(showToast(`${product.title} added to cart`));
  }

  function handleWishlist(e) {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  }

  const outOfStock = product.stock <= 0;
  const priceNow = salePrice(product);
  const hasDiscount = product.discountPercentage > 0;

  if (view === "list") {
    return (
      <div className="flex gap-4 rounded-xl bg-white p-4 shadow-card">
        <Link href={`/product?id=${product.id}`} className="shrink-0">
          <img src={product.thumbnail} alt={product.title} className="h-32 w-32 rounded-lg bg-gray-100 object-contain p-2" />
        </Link>
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">{product.brand}</p>
              <Link href={`/product?id=${product.id}`} className="text-base font-semibold hover:text-brand-600">
                {product.title}
              </Link>
              <p className="mt-1 text-sm text-muted line-clamp-2">{product.description}</p>
            </div>
            <button onClick={handleWishlist} className={`rounded-full p-2 ${isWished ? "text-rose-500" : "text-gray-400"} hover:bg-gray-100`}>
              <HeartIcon filled={isWished} className="h-5 w-5" />
            </button>
          </div>
          <Rating value={product.rating} count={product.reviews?.length} />
          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <p className="text-lg font-bold">{formatPrice(priceNow)}</p>
              {hasDiscount && (
                <p className="text-xs text-muted">
                  <span className="line-through">{formatPrice(product.price)}</span>
                  <span className="ml-2 font-semibold text-emerald-600">-{Math.round(product.discountPercentage)}%</span>
                </p>
              )}
            </div>
            <button onClick={handleAdd} disabled={outOfStock} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-white shadow-card">
      <Link href={`/product?id=${product.id}`} className="relative block overflow-hidden rounded-t-xl">
        <img src={product.thumbnail} alt={product.title} className="h-52 w-full bg-gray-100 object-contain p-4" />
        {hasDiscount && (
          <span className="badge absolute left-3 top-3 bg-emerald-100 text-emerald-700">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        {outOfStock && (
          <span className="badge absolute right-3 top-3 bg-gray-100 text-gray-400">Out of stock</span>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute right-3 bottom-3 rounded-full bg-white p-2 shadow ${isWished ? "text-rose-500" : "text-gray-400"}`}
          aria-label="Toggle wishlist"
        >
          <HeartIcon filled={isWished} className="h-4 w-4" />
        </button>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-wide text-muted">{product.brand}</p>
        <Link href={`/product?id=${product.id}`} className="mt-0.5 text-sm font-semibold hover:text-brand-600 line-clamp-1" title={product.title}>
          {product.title}
        </Link>
        <div className="mt-1">
          <Rating value={product.rating} count={product.reviews?.length} />
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <p className="text-base font-bold">{formatPrice(priceNow)}</p>
            {hasDiscount && (
              <p className="text-xs text-muted line-through">{formatPrice(product.price)}</p>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
