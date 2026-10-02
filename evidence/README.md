# ShopNest product grid evidence

Before screenshots are the original user-provided images. After screenshots were captured from the updated app with live DummyJSON data at 1280px desktop width; the additional narrow capture uses a 393px viewport.

| Scenario | Before | After |
| --- | --- | --- |
| Smartphones, page 1 | [Before](before/1-smartphones-page-1.png) | [After](after/1-smartphones-page-1.png) |
| After clicking page 2 | [Before](before/2-after-clicking-page-2.png) | [After](after/2-after-clicking-page-2.png) |
| Mobile Accessories | [Before](before/3-mobile-accessories.png) | [After](after/3-mobile-accessories.png) |

[Mobile Accessories at 393px](after/4-mobile-accessories-narrow.png)

## Changes verified

- Product images use contain sizing instead of cropping, in grid and list views.
- Prices display USD with exactly two decimal places.
- Two-line names fit while prices and Add buttons remain aligned across each desktop row.
- Disabled out-of-stock Add buttons are visually distinct.
- Smartphones pages contain 12 and 4 distinct products; Mobile Accessories pages contain 12 and 2.
- Next, Previous, refresh, browser Back, and resetting pagination on category changes work.
- Negative and oversized page parameters resolve to valid pages.
- The 393px viewport has no horizontal page overflow.

Production build and git diff --check passed. Build reported existing image-optimization and hook-dependency lint warnings. Browser verification used the development server.
