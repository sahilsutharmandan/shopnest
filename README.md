# ShopNest

A small e-commerce store built with Next.js 14, Tailwind and Redux Toolkit. Product data
comes from the free [DummyJSON](https://dummyjson.com) API. Everything else (cart,
wishlist, orders, login state) lives in `localStorage`.

## Get started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

- `npm run dev` – dev server
- `npm run build` – static export to `out/`
- `npm run lint` – ESLint

## Test accounts

Login uses DummyJSON demo users. Sign in with `emilys` / `emilyspass`.

Payment is simulated:

- Any `4242 4242 4242 4242` card succeeds
- Any card starting with `4000` is declined
