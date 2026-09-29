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

export function sortProducts(products, sort) {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "discount":
      return copy.sort((a, b) => b.discountPercentage - a.discountPercentage);
    default:
      return copy;
  }
}
