"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import ProductCard from "@/components/ProductCard";
import { HeartIcon } from "@/components/Icons";

export default function WishlistClient() {
  const items = useSelector((state) => state.wishlist.items);

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-card">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-semibold">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted">Save products you love by tapping the heart.</p>
          <Link href="/products" className="btn-primary mt-6 inline-flex">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      <p className="mt-1 text-sm text-muted">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
