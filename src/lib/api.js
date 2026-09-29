const BASE_URL = "https://dummyjson.com";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function getAllProducts() {
  const data = await request("/products?limit=0");
  return data.products;
}

export async function getProduct(id) {
  return request(`/products/${id}`);
}

export async function getCategories() {
  return request("/products/categories");
}

export async function getCategoryProducts(slug, limit = 8) {
  const data = await request(`/products/category/${slug}?limit=${limit}`);
  return data.products;
}

export async function getFeaturedProducts() {
  const data = await request("/products?limit=12&sortBy=rating&order=desc");
  return data.products;
}

export async function login(username, password) {
  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}
