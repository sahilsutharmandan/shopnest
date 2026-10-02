"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getCategories } from "@/lib/api";
import { capitalize } from "@/lib/format";
import { FilterIcon, GridIcon, ListIcon } from "@/components/Icons";
import { filterProducts, sortProducts } from "@/lib/filters";

const PAGE_SIZE = 12;

export default function ProductsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const rating = Number(params.get("rating") || 0);
  const priceMax = Number(params.get("priceMax") || 0);
  const page = Number(params.get("page") || 1);


  useEffect(() => {
    setLoading(true);
    Promise.all([getAllProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => sortProducts(filterProducts(products, { category, q, rating, priceMax }), sort),
    [products, category, q, rating, priceMax, sort],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number.isSafeInteger(page) ? page : 1), totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateParam(key, value) {
    const next = new URLSearchParams(params.toString());
    if (value === "" || value === null || value === undefined) next.delete(key);
    else next.set(key, String(value));
    if (key !== "page") next.delete("page");
    router.push(`/products?${next.toString()}`);
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{category ? capitalize(category) : "All products"}</h1>
          <p className="text-sm text-muted">{filtered.length} results{q ? ` for "${q}"` : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen((v) => !v)} className="btn-outline lg:hidden">
            <FilterIcon className="h-4 w-4" /> Filters
          </button>
          <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="input w-auto">
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="rating">Top rated</option>
            <option value="discount">Biggest discount</option>
          </select>
          <div className="hidden overflow-hidden rounded-lg border border-gray-300 sm:flex">
            <button
              onClick={() => setView("grid")}
              className={`p-2 ${view === "grid" ? "bg-brand-50 text-brand-600" : "text-gray-500"}`}
              aria-label="Grid view"
            >
              <GridIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 ${view === "list" ? "bg-brand-50 text-brand-600" : "text-gray-500"}`}
              aria-label="List view"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
          <div className="rounded-xl bg-white p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold">Category</p>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => updateParam("category", "")}
                  className={`w-full rounded px-2 py-1 text-left ${!category ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => updateParam("category", c.slug)}
                    className={`w-full rounded px-2 py-1 text-left ${category === c.slug ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-xl bg-white p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold">Max price</p>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceMax || 2000}
              onChange={(e) => updateParam("priceMax", e.target.value)}
              className="w-full"
            />
            <p className="mt-2 text-sm text-muted">Up to ${priceMax || 2000}</p>
          </div>

          <div className="mt-4 rounded-xl bg-white p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold">Rating</p>
            <div className="flex flex-wrap gap-2">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => updateParam("rating", rating === r ? "" : r)}
                  className={`rounded-lg border px-3 py-1 text-sm ${rating === r ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-300"}`}
                >
                  {r}★ & up
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-card">
              <p className="font-medium">No products match your filters</p>
              <p className="text-sm text-muted">Try clearing a filter or searching for something else.</p>
            </div>
          ) : (
            <>
              <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} view={view} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateParam("page", currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn-outline disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      aria-current={currentPage === i + 1 ? "page" : undefined}
                      onClick={() => updateParam("page", i + 1)}
                      className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${currentPage === i + 1 ? "bg-brand-600 text-white" : "bg-white text-gray-700 shadow-card"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => updateParam("page", currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn-outline disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
