import type { APIRoute } from 'astro';
import { u } from '../data/site';

export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(u('/sitemap.xml'), site)}\n`, { headers: { 'Content-Type': 'text/plain' } });
