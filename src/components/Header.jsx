"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { openDrawer } from "@/store/cartSlice";
import { logout } from "@/store/authSlice";
import { useCartCount } from "@/hooks/useCart";
import { CartIcon, HeartIcon, MenuIcon, CloseIcon, SearchIcon, UserIcon } from "./Icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products?category=smartphones", label: "Phones" },
  { href: "/products?category=laptops", label: "Laptops" },
  { href: "/products?sort=discount", label: "Deals" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const count = useCartCount();
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const user = useSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  function onSearch(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="bg-brand-900 py-1.5 text-center text-xs text-brand-100">
        Free shipping on orders over $50 · Use code <span className="font-semibold text-white">SAVE10</span> for 10% off
      </div>
      <div className="container-page flex h-16 items-center gap-4">
        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">S</span>
          <span>
            Shop<span className="text-brand-600">Nest</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "text-brand-600" : "text-gray-600 hover:text-ink"}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden flex-1 lg:block lg:max-w-sm">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="input pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <Link href="/wishlist" className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Wishlist">
            <HeartIcon className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <div className="relative">
            {user ? (
              <button onClick={() => setAccountOpen((v) => !v)} className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100">
                <img src={user.image} alt="" className="h-7 w-7 rounded-full bg-gray-100" />
                <span className="hidden text-sm font-medium sm:inline">{user.firstName}</span>
              </button>
            ) : (
              <Link href="/login" className="rounded-full p-2 hover:bg-gray-100" aria-label="Sign in">
                <UserIcon className="h-5 w-5" />
              </Link>
            )}
            {accountOpen && user && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg">
                <Link href="/orders" className="block px-4 py-2 hover:bg-gray-50" onClick={() => setAccountOpen(false)}>
                  My orders
                </Link>
                <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-50" onClick={() => setAccountOpen(false)}>
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    dispatch(logout());
                    setAccountOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <button onClick={() => dispatch(openDrawer())} className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Cart">
            <CartIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <form onSubmit={onSearch} className="container-page py-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="input" />
          </form>
          <nav className="container-page flex flex-col pb-3 text-sm font-medium">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
