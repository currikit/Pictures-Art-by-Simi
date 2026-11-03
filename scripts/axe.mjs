import { chromium } from 'playwright';
import fs from 'node:fs';
const axe = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const base = process.argv[2];
const pages = ['/', '/shop', '/products/couple-caricature-canvas', '/hamper-builder', '/custom-order', '/reviews', '/about', '/help', '/nope'];
const b = await chromium.launch(); let total = 0;
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  for (const pg of pages) {
    await p.goto(base + pg, { waitUntil: 'networkidle' });
    await p.addScriptTag({ content: axe });
    const r = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.filter(v => ['serious', 'critical'].includes(v.impact)).map(v => `${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ') + (n.any?.[0]?.data?.contrastRatio ? ` (${n.any[0].data.contrastRatio})` : '')).join(' | ')}`));
    total += r.length; if (r.length) console.log(w, pg, r);
  }
  await p.close();
}
await b.close(); console.log('serious/critical violations:', total);
