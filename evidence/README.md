# Cart and checkout evidence

Before images are the five originals supplied with the request. After images were captured in Chrome at 1280 × 900. The header-only original is paired with a full-page viewport capture.

## Quantity 2: $219.58 subtotal

Before

![Before](before/1-cart-qty-2.png)

After

![After](after/1-cart-qty-2.png)

## Header badge immediately shows 2

Before

![Before](before/2-header-after-closing-cart.png)

After

![After](after/2-header-after-closing-cart.png)

## Adding again gives quantity 3 and $329.37

Before

![Before](before/3-after-adding-again.png)

After

![After](after/3-after-adding-again.png)

## Checkout summary uses quantity 3 and currency rounded to cents

Before

![Before](before/4-checkout-empty.png)

After

![After](after/4-checkout-empty.png)

## Empty address stays on Address with field errors

Before

![Before](before/5-after-continue.png)

After

![After](after/5-after-continue.png)

## Additional verification

![Mobile validation at 393px](after/6-mobile-validation.png)

![Valid details reach review](after/7-valid-review.png)

Browser assertions passed for quantity 2 → 3, immediate badge updates, $219.58/$329.37 subtotals, persistence after reload, seven empty-address errors, four empty-payment errors, valid progression to Review, $355.72 total, and no horizontal overflow at 393px. No order was submitted.

Production build and git diff --check passed. Existing image optimization lint warnings remain.
