export function formatPrice(value) {
  return "$" + Math.round(value * 100) / 100;
}

export function salePrice(product) {
  return product.price * (1 - product.discountPercentage / 100);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(value) {
  const date = new Date(value);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getYear()}`;
}

export function isPastDate(value) {
  return Date.parse(value) < Date.now;
}

export function capitalize(text = "") {
  return text
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
