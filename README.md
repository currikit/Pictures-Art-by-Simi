# Pictures Art by Simi website

Static site for Pictures art ~BY SIMI (@pics_craft66), built by Currikit with Astro.

## Run it

```bash
npm install
npm run dev       # local preview at http://localhost:4321
npm run build     # production files in dist/
```

Deploy `dist/` to Netlify (build command `npm run build`, publish directory `dist`), then point the domain through Cloudflare.

## Pages

| Path | What it does |
| --- | --- |
| `/` | Darkroom hero, occasions, "See your photo on it first", best sellers, hamper builder teaser, how to order |
| `/shop` | All products with filters for who, occasion and kind of gift (filters are kept in the URL) |
| `/products/<slug>` | One page per product with a pre-filled WhatsApp order button |
| `/hamper-builder` | Pick a box and items; sends the list to WhatsApp |
| `/custom-order` | Order form; opens WhatsApp or email with everything written out |
| `/reviews` | Voice note, review screenshots, Instagram reels (load on tap) |
| `/about` | Simi's story and how she works |
| `/help` | FAQ, cancellation, damage and privacy policies |
| `/404` | "This page didn't develop" |

## Updating products and prices

Everything Simi changes lives in `src/data/site.ts`:

- `products`: name, photo file, occasions, who it's for, `priceFrom` (rupees) and `makingDays`. A `null` price shows "price on WhatsApp".
- New photo: put a JPG in `src/assets/products/` and use its file name in `image`.
- `faqs`, `hamperBoxes`, `hamperItems`, `reviews`.

## Before launch: placeholders to replace

Search the project for `placeholder` and `[`:

- Prices for every product except the ₹199 snack hamper
- Making time per product, delivery charges, payment methods
- Damaged-item policy and preview-photo policy (Help page)
- Voice note audio and review screenshots (Reviews page)
- Photo of Simi or her workspace and her story (About page)
- Final domain in `astro.config.mjs`, `public/robots.txt` and `src/data/site.ts`
- Higher-resolution originals of the product photos

## Notes

- No customer data is stored by the site. Photos picked on the homepage or the order form never leave the phone.
- Licensed toys and logos are listed with generic names only.
- Design decisions are in `DESIGN.md`.
- Regenerate the share image with `node scripts/og.mjs`.

## Checking the flows

`scripts/flows.mjs` drives every page and flow (links, shop filters, hamper builder, order form, menu, 404, keyboard) and prints PASS or FAIL for each:

```bash
npm i -D playwright && npx playwright install chromium
npm run build && npx astro preview --port 4500
node scripts/flows.mjs http://127.0.0.1:4500   # 25 user-flow checks
node scripts/axe.mjs http://127.0.0.1:4500     # accessibility scan (npm i -D axe-core)
```
