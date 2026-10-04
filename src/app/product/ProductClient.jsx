"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, openDrawer } from "@/store/cartSlice";
import { toggleWishlist } from "@/store/wishlistSlice";
import { showToast } from "@/store/toastSlice";
import { getProduct, getCategoryProducts } from "@/lib/api";
import { formatPrice, salePrice, formatDate, capitalize } from "@/lib/format";
import Rating from "@/components/Rating";
import ProductCard from "@/components/ProductCard";
import QtySelect from "@/components/QtySelect";
import { HeartIcon, TruckIcon, ShieldIcon, CheckIcon } from "@/components/Icons";

export default function ProductClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setQty(1);

    async function load() {
      try {
        const p = await getProduct(id);
        if (cancelled) return;
        setProduct(p);
        setLoading(false);
        const list = await getCategoryProducts(p.category, 8);
        if (!cancelled) setRelated(list.filter((item) => item.id !== id).slice(0, 4));
      } catch {
        if (!cancelled) setProduct(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!product && loading) {
    return (
      <div className="container-page grid gap-8 py-10 lg:grid-cols-2">
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
          <div className="h-10 w-72 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-lg font-medium">Product not found</p>
        <Link href="/products" className="btn-primary mt-4 inline-flex">Back to products</Link>
      </div>
    );
  }

  const isWished = wishlist.some((item) => item.id === product.id);
  const outOfStock = product.stock <= 0;
  const priceNow = salePrice(product);

  function handleAdd() {
    if (outOfStock) return;
    dispatch(addToCart({ product, qty }));
    dispatch(openDrawer());
    dispatch(showToast(`${product.title} added to cart`));
  }

  return (
    <div className={`container-page py-8 transition-opacity ${loading ? "opacity-60" : ""}`}>
      <nav className="mb-4 flex flex-wrap gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink">Shop</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-ink">{capitalize(product.category)}</Link>
        <span>/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <Gallery images={product.images} title={product.title} />

        <div>
          <p className="text-sm uppercase tracking-wide text-muted">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.title}</h1>
          <div className="mt-3 flex items-center gap-4">
            <Rating value={product.rating} count={product.reviews?.length} size="h-5 w-5" />
            <span className="text-sm text-muted">SKU: {product.sku}</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(priceNow)}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-muted line-through">{formatPrice(product.price)}</span>
                <span className="badge bg-emerald-100 text-emerald-700">-{Math.round(product.discountPercentage)}%</span>
              </>
            )}
          </div>

          <p className="mt-4 text-muted">{product.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
            <div className={`rounded-lg px-3 py-2 ${outOfStock ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {outOfStock ? "Out of stock" : `In stock (${product.stock} left)`}
            </div>
            <div className="rounded-lg bg-gray-100 px-3 py-2 text-gray-700">{product.shippingInformation}</div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QtySelect value={qty} max={product.stock} onChange={setQty} />
            <button onClick={handleAdd} disabled={outOfStock} className="btn-primary flex-1 sm:flex-none">
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
            <button
              onClick={() => dispatch(toggleWishlist(product))}
              className={`btn-outline ${isWished ? "text-rose-500" : ""}`}
              aria-label="Toggle wishlist"
            >
              <HeartIcon filled={isWished} className="h-4 w-4" />
              {isWished ? "Saved" : "Save"}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-gray-200 pt-6 text-sm">
            <div className="flex items-start gap-2"><TruckIcon className="h-5 w-5 text-brand-600" /><span>Free shipping over $50</span></div>
            <div className="flex items-start gap-2"><ShieldIcon className="h-5 w-5 text-brand-600" /><span>{product.warrantyInformation}</span></div>
            <div className="flex items-start gap-2"><CheckIcon className="h-5 w-5 text-brand-600" /><span>{product.returnPolicy}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-4 flex gap-4 border-b border-gray-200">
          {["description", "reviews", "details"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-2 py-2 text-sm font-medium capitalize ${tab === t ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500"}`}
            >
              {t === "reviews" ? `Reviews (${product.reviews?.length || 0})` : t}
            </button>
          ))}
        </div>
        {tab === "description" && <p className="text-sm text-gray-700">{product.description}</p>}
        {tab === "details" && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-muted">Weight</dt><dd>{product.weight} kg</dd></div>
            <div><dt className="text-muted">Dimensions</dt><dd>{product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm</dd></div>
            <div><dt className="text-muted">Min. order qty</dt><dd>{product.minimumOrderQuantity}</dd></div>
            <div><dt className="text-muted">Barcode</dt><dd>{product.meta.barcode}</dd></div>
          </dl>
        )}
        {tab === "reviews" && (
          <ul className="divide-y divide-gray-100">
            {product.reviews?.map((review, i) => (
              <li key={i} className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{review.reviewerName}</p>
                  <span className="text-xs text-muted">{formatDate(review.date)}</span>
                </div>
                <Rating value={review.rating} />
                <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">You might also like</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Gallery({ images, title }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <img src={images[active]} alt={title} className="h-96 w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${active === i ? "border-brand-500" : "border-transparent"}`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
