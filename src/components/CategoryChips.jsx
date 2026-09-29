"use client";

import Link from "next/link";
import { capitalize } from "@/lib/format";

const highlight = [
  { slug: "smartphones", emoji: "📱" },
  { slug: "laptops", emoji: "💻" },
  { slug: "fragrances", emoji: "🌸" },
  { slug: "beauty", emoji: "💄" },
  { slug: "furniture", emoji: "🛋️" },
  { slug: "groceries", emoji: "🛒" },
  { slug: "mens-watches", emoji: "⌚" },
  { slug: "womens-bags", emoji: "👜" },
];

export default function CategoryChips() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {highlight.map((cat) => (
        <Link
          key={cat.slug}
          href={`/products?category=${cat.slug}`}
          className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 text-center shadow-card transition hover:-translate-y-0.5"
        >
          <span className="text-3xl">{cat.emoji}</span>
          <span className="text-xs font-medium">{capitalize(cat.slug)}</span>
        </Link>
      ))}
    </div>
  );
}
