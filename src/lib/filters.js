export function filterProducts(products, filters) {
  const { category, q, rating, priceMax } = filters;
  return products.filter((p) => {
    if (category && p.category !== category) return false;
    if (q && !`${p.title} ${p.brand} ${p.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (rating && p.rating < rating) return false;
    if (priceMax && p.price > priceMax) return false;
    return true;
  });
}

const byField = (key, direction = 1) => (a, b) => (a[key] - b[key]) * direction;

const sorters = {
  "price-asc": byField("price"),
  "price-desc": byField("price", -1),
  rating: byField("rating", -1),
  discount: byField("discountPercentage"),
  name: (a, b) => a.title.localeCompare(b.title),
};

export function sortProducts(products, sort) {
  const compare = sorters[sort];
  return compare ? [...products].sort(compare) : [...products];
}
