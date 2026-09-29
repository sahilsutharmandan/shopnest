import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/products?category=smartphones", label: "Smartphones" },
      { href: "/products?category=laptops", label: "Laptops" },
      { href: "/products?category=fragrances", label: "Fragrances" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/orders", label: "Orders" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "#", label: "Shipping" },
      { href: "#", label: "Returns" },
      { href: "#", label: "Contact us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">
            Shop<span className="text-brand-600">Nest</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Everyday products, fair prices and fast delivery. Made for people who like shopping from the couch.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} ShopNest. Product data from DummyJSON.
      </div>
    </footer>
  );
}
