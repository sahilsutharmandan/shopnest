export function formatPrice(value) {
  return "$" + Math.round(value * 100) / 100;
}

export function salePrice(product) {
  return product.price * (1 - product.discountPercentage / 100);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function capitalize(text = "") {
  return text
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
