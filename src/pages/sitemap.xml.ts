import type { APIRoute } from 'astro';
import { products, u } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const paths = ['/', '/shop', '/hamper-builder', '/custom-order', '/reviews', '/about', '/help', ...products.map((p) => `/products/${p.slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${new URL(u(p), site)}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
