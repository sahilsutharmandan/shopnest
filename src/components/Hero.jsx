import Link from "next/link";

export default function Hero() {
  return (
    <section className="container-page grid gap-6 py-10 lg:grid-cols-2 lg:items-center">
      <div className="space-y-5">
        <p className="badge bg-brand-100 text-brand-700">New season</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Everyday products,
          <br />
          <span className="text-brand-600">fair prices.</span>
        </h1>
        <p className="max-w-md text-muted">
          Shop laptops, phones, groceries, fragrances and more. Free shipping on orders over $50.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/products" className="btn-primary">Shop now</Link>
          <Link href="/products?sort=discount" className="btn-outline">See deals</Link>
        </div>
      </div>
      <div className="relative">
        <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-900" />
        <img
          src="https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp"
          alt=""
          className="absolute -left-4 top-8 h-32 w-32 rounded-2xl bg-white p-2 shadow-lg sm:h-40 sm:w-40"
        />
        <img
          src="https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp"
          alt=""
          className="absolute right-4 bottom-4 h-36 w-36 rounded-2xl bg-white p-2 shadow-lg sm:h-48 sm:w-48"
        />
      </div>
    </section>
  );
}
