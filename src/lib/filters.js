export function filterProducts(products, filters) {
  const { category, q, rating, priceMax } = filters;
  let result = products;

  if (category) {
    result = result.filter((p) => p.category === category);
  }
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((p) =>
      `${p.title} ${p.brand} ${p.description}`.toLowerCase().includes(needle),
    );
  }
  if (rating) {
    result = result.filter((p) => p.rating >= rating);
  }
  if (priceMax) {
    result = result.filter((p) => p.price <= priceMax);
  }

  return result;
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
