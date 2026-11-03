// Copy dist/ to a preview folder with every root-relative URL made relative,
// and directory links pointed at index.html, so it works on any host path.
import fs from 'node:fs'; import path from 'node:path';
const [src, out] = process.argv.slice(2);
fs.rmSync(out, { recursive: true, force: true }); fs.cpSync(src, out, { recursive: true });
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(out);
const fix = (url, prefix) => {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const m = url.match(/^([^?#]*)([?#].*)?$/); let p = m[1]; const rest = m[2] || '';
  if (p.startsWith('/_astro/') || /\.[a-z0-9]{2,5}$/i.test(p)) return prefix + p.slice(1) + rest;
  p = p.replace(/^\/+|\/+$/g, '');
  return prefix + (p ? p + '/' : '') + 'index.html' + rest;
};
for (const f of files) {
  if (f.endsWith('.html')) {
    const depth = path.relative(out, path.dirname(f)).split(path.sep).filter(Boolean).length;
    const prefix = depth ? '../'.repeat(depth) : './';
    let h = fs.readFileSync(f, 'utf8');
    h = h.replace(/(href|src|action)="(\/[^"]*)"/g, (_, a, u) => `${a}="${fix(u, prefix)}"`);
    h = h.replace(/srcset="([^"]*)"/g, (_, s) => `srcset="${s.split(',').map((part) => { const [u, ...r] = part.trim().split(/\s+/); return [fix(u, prefix), ...r].join(' '); }).join(', ')}"`);
    h = h.replace(/url\((\/_astro\/[^)]*)\)/g, (_, u) => `url(${prefix}${u.slice(1)})`);
    fs.writeFileSync(f, h);
  } else if (f.endsWith('.css')) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/url\(\/_astro\/([^)]*)\)/g, 'url(./$1)');
    fs.writeFileSync(f, c);
  }
}
const list = walk(out).map((f) => path.relative(out, f));
console.log(list.length, 'files');
fs.writeFileSync(path.join(out, '..', 'preview-files.json'), JSON.stringify(list));
