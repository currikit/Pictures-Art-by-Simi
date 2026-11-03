// Drive every user flow on the built site and report pass/fail with evidence.
import { chromium } from 'playwright';
const BASE = (process.argv[2] || 'http://127.0.0.1:4500').replace(/\/$/, '');
const ORIGIN = new URL(BASE).origin;
const BASEPATH = new URL(BASE).pathname.replace(/\/$/, '');
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  :: ' + detail : ''}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !m.location().url.includes('no-such-page')) errors.push(m.text()); });
const failed = [];
page.on('requestfailed', (r) => { if (r.url().startsWith(ORIGIN)) failed.push(r.url()); });
page.on('response', (r) => { if (r.url().startsWith(ORIGIN) && r.status() >= 400 && !r.url().includes('no-such-page')) failed.push(`${r.status()} ${r.url()}`); });

// 1. Every internal link on every page resolves
const seen = new Set(); const queue = [BASEPATH + '/']; const broken = [];
while (queue.length) {
  const p = queue.shift(); if (seen.has(p)) continue; seen.add(p);
  const res = await page.goto(ORIGIN + p, { waitUntil: 'domcontentloaded' });
  if (!res || res.status() >= 400) { broken.push(`${p} -> ${res?.status()}`); continue; }
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  for (const h of hrefs) {
    if (!h || !h.startsWith('/') || h.startsWith('//')) continue;
    const clean = h.split('#')[0].split('?')[0] || '/';
    if (!seen.has(clean)) queue.push(clean);
  }
}
check('All internal links resolve', broken.length === 0, `${seen.size} pages crawled${broken.length ? '; broken: ' + broken.join(', ') : ''}`);

// 2. One h1 per page, unique titles
const titles = new Map(); const h1bad = [];
for (const p of seen) {
  await page.goto(ORIGIN + p, { waitUntil: 'domcontentloaded' });
  const n = await page.locator('h1').count(); if (n !== 1) h1bad.push(`${p}:${n}`);
  const t = await page.title(); titles.set(t, (titles.get(t) || []).concat(p));
}
const dupTitles = [...titles].filter(([, v]) => v.length > 1);
check('Exactly one h1 per page', h1bad.length === 0, h1bad.join(', '));
check('Every page title is unique', dupTitles.length === 0, dupTitles.map(([t, v]) => `${t}: ${v.join(',')}`).join('; '));

// 3. Mobile menu opens, shows links, closes with Escape
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const menu = page.locator('.menu-btn');
await menu.click();
const navVisible = await page.locator('#site-nav').isVisible();
const expanded = await menu.getAttribute('aria-expanded');
await page.keyboard.press('Escape');
const closed = !(await page.locator('#site-nav').isVisible());
check('Mobile menu opens and closes with Escape', navVisible && expanded === 'true' && closed, `visible=${navVisible} expanded=${expanded} closedAfterEsc=${closed}`);

// 4. Develop strip: picking a photo swaps all four mockups to the visitor's photo
await page.locator('#try').scrollIntoViewIfNeeded();
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
await page.setInputFiles('#try .pick-input', { name: 'me.png', mimeType: 'image/png', buffer: png });
await page.waitForTimeout(300);
const srcs = await page.$$eval('#try .dv', (els) => els.map((e) => e.src));
const alts = await page.$$eval('#try .dv', (els) => els.map((e) => e.alt));
check('Develop strip shows the picked photo on all 4 products', srcs.length === 4 && srcs.every((s) => s.startsWith('blob:')) && alts.every((a) => a.startsWith('Your photo')), `${srcs.filter((s) => s.startsWith('blob:')).length}/4 blob images`);

// 5. Occasions menu (inside the phone menu) deep-links into a filtered shop
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.locator('.menu-btn').click();
await page.locator('.menu-toggle').click();
await page.locator('#occ-menu a', { hasText: 'Rakhi' }).click();
await page.waitForURL(/shop/);
await page.waitForTimeout(300);
const rakhiCount = await page.locator('#count').textContent();
const rakhiPressed = await page.locator('fieldset[data-key="occasion"] .chip[data-val="rakhi"]').getAttribute('aria-pressed');
const rakhiVisible = await page.locator('#grid .card:visible').count();
check('Occasions menu opens the shop filtered', rakhiPressed === 'true' && Number(rakhiCount) > 0 && Number(rakhiCount) === rakhiVisible && rakhiVisible < 24, `count=${rakhiCount} visible=${rakhiVisible}`);

// 5b. Category tile on home filters the shop
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.locator('a.cat', { hasText: 'Keychains' }).click();
await page.waitForURL(/category=keychains/);
await page.waitForTimeout(300);
const kc = await page.locator('#grid .card:visible').count();
const kcCats = await page.$$eval('#grid .card:not([hidden])', (els) => [...new Set(els.map((e) => e.dataset.category))]);
check('Category tile shows only that category', kc > 0 && kcCats.length === 1 && kcCats[0] === 'keychains', `visible=${kc} cats=${kcCats}`);

// 5c. Header search finds products by name
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.locator('.search-btn').click();
await page.fill('#q', 'caricature');
await page.keyboard.press('Enter');
await page.waitForURL(/q=caricature/);
await page.waitForTimeout(300);
const names = await page.$$eval('#grid .card:not([hidden]) .name', (els) => els.map((e) => e.textContent));
const shopQ = await page.inputValue('#shop-q');
check('Header search lands on matching gifts', names.length >= 3 && names.every((n) => /caricature/i.test(n)) && shopQ === 'caricature', `${names.length} results: ${names.join(', ')}`);
await page.fill('#shop-q', 'zzzz');
await page.waitForTimeout(200);
check('Search with no match shows the custom-gift message', await page.locator('#empty').isVisible());

// 6. Shop filters combine, update count and URL, and show an empty state
await page.goto(BASE + '/shop', { waitUntil: 'domcontentloaded' });
await page.locator('fieldset[data-key="for"] .chip[data-val="parents"]').click();
await page.locator('fieldset[data-key="occasion"] .chip[data-val="valentines"]').click();
const emptyShown = await page.locator('#empty').isVisible();
const url6 = page.url();
await page.locator('fieldset[data-key="occasion"] .chip[data-val=""]').click();
const parentsCount = Number(await page.locator('#count').textContent());
const visibleCards = await page.locator('#grid .card:visible').count();
check('Shop filters: empty state, count matches visible cards, URL keeps filters', emptyShown && parentsCount === visibleCards && parentsCount > 0 && url6.includes('for=parents') && url6.includes('occasion=valentines'), `empty=${emptyShown} count=${parentsCount} visible=${visibleCards} url=${url6.replace(BASE, '')}`);

// 7. Product page: WhatsApp link names the product
await page.goto(BASE + '/products/couple-caricature-canvas', { waitUntil: 'domcontentloaded' });
const waHref = await page.locator('.ctas a.btn-red').getAttribute('href');
check('Product WhatsApp button pre-fills the product name', !!waHref && waHref.startsWith('https://wa.me/919925679329') && decodeURIComponent(waHref).includes('Couple caricature canvas'), decodeURIComponent(waHref || '').slice(0, 90));
const formLink = await page.locator('.ctas a.btn-line').getAttribute('href');
await page.goto(ORIGIN + formLink, { waitUntil: 'domcontentloaded' });
const selected = await page.locator('#co-what').inputValue();
check('"Fill the order form" pre-selects the product', selected === 'Couple caricature canvas', `selected=${selected}`);

// 8. Hamper builder: blocked when empty, message lists choices
await page.goto(BASE + '/hamper-builder', { waitUntil: 'domcontentloaded' });
const disabledAtStart = await page.locator('#send').getAttribute('aria-disabled');
await page.locator('.item', { hasText: 'Chocolates' }).click();
await page.locator('.item', { hasText: 'Polaroid photo prints' }).click();
await page.locator('.box-opt', { hasText: 'Overloaded box' }).click();
await page.fill('#hb-name', 'Riya');
const hbHref = decodeURIComponent(await page.locator('#send').getAttribute('href'));
const crateTags = await page.locator('#crate span').count();
check('Hamper builder: send blocked until an item is added', disabledAtStart === 'true', `aria-disabled at start=${disabledAtStart}`);
check('Hamper builder: WhatsApp message has box, items and name', hbHref.includes('Box: Overloaded box') && hbHref.includes('Chocolates') && hbHref.includes('Polaroid photo prints') && hbHref.includes('Name tag: Riya') && crateTags === 2, `tags=${crateTags}`);

// 9. Custom order: validation blocks, focuses first error, then opens WhatsApp
await page.goto(BASE + '/custom-order', { waitUntil: 'domcontentloaded' });
let popup = null; ctx.on('page', (p) => { popup = p; });
await page.locator('#co button[type=submit]').click();
const errWhat = await page.locator('#err-what').isVisible();
const focused = await page.evaluate(() => document.activeElement?.id);
await page.selectOption('#co-what', 'Resin flower keychain');
await page.fill('#co-pin', '4001');
await page.fill('#co-you', 'Asha');
await page.locator('#co button[type=submit]').click();
const pinErr = await page.locator('#err-pin').isVisible();
await page.fill('#co-pin', '400001');
const [opened] = await Promise.all([
  ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null),
  page.locator('#co button[type=submit]').click(),
]);
const openedUrl = opened ? decodeURIComponent(opened.url()) : '';
check('Custom order: empty submit shows error and focuses the field', errWhat && focused === 'co-what', `errVisible=${errWhat} focus=${focused}`);
check('Custom order: bad pincode is rejected', pinErr);
const sentShown = await page.locator('#sent').isVisible();
const sentHref = decodeURIComponent((await page.locator('#sent-link').getAttribute('href')) || '');
check('Custom order: valid form opens WhatsApp with the details', (openedUrl.includes('wa.me') || openedUrl.includes('whatsapp')) && openedUrl.includes('Resin'), openedUrl.slice(0, 80) || 'no new tab opened');
check('Custom order: fallback link shown with the same message', sentShown && sentHref.includes('Resin flower keychain') && sentHref.includes('400001'), `shown=${sentShown}`);
const waBarOnForm = await page.locator('.wa-bar').count();
check('Form pages have one WhatsApp action, not two', waBarOnForm === 0, `floating bars=${waBarOnForm}`);
const dateMin = await page.locator('#co-date').getAttribute('min');
check('Date pickers block past dates', !!dateMin && dateMin.length === 10, `min=${dateMin}`);
if (opened) await opened.close();

// 10. Help FAQ opens; 404 page renders with links
await page.goto(BASE + '/help', { waitUntil: 'domcontentloaded' });
await page.locator('summary', { hasText: 'How do I order?' }).click();
check('Help FAQ expands', await page.locator('details[open]').count() === 1);
const r404 = await page.goto(BASE + '/no-such-page', { waitUntil: 'domcontentloaded' });
check('Unknown URL shows the 404 page', (await page.locator('h1').textContent())?.includes('went missing') ?? false, `status=${r404?.status()}`);

// 11. Keyboard: skip link first, nav reachable
await ctx.close();
const desk = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await desk.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await desk.keyboard.press('Tab');
const first = await desk.evaluate(() => document.activeElement?.textContent?.trim());
await desk.keyboard.press('Enter');
const afterSkip = await desk.evaluate(() => document.activeElement?.id);
check('Skip link is the first Tab stop and moves focus to main', first === 'Skip to content' && afterSkip === 'main', `first=${first} after=${afterSkip}`);

check('No console errors during all flows', errors.length === 0, errors.slice(0, 3).join(' | '));
check('No failed same-origin requests', failed.length === 0, failed.slice(0, 3).join(' | '));
await browser.close();
const bad = results.filter((r) => !r.ok);
console.log(`\n${results.length - bad.length}/${results.length} checks passed`);
process.exit(bad.length ? 1 : 0);
