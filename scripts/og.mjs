import sharp from 'sharp';
const dir = new URL('../src/assets/products/', import.meta.url).pathname;
const pics = ['23-couple-caricature-canvas.jpg', '03-birthday-girly-hamper-box.jpg', '19-resin-flower-keychain.jpg'];
const pol = async (f, rot) => {
  const photo = await sharp(dir + f).resize(220, 220, { fit: 'cover' }).toBuffer();
  const card = await sharp({ create: { width: 244, height: 284, channels: 4, background: '#FFFFFF' } }).composite([{ input: photo, left: 12, top: 12 }]).png().toBuffer();
  return sharp(card).rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
};
const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE4EE"/><stop offset=".6" stop-color="#FFF0F5"/><stop offset="1" stop-color="#EFE9FC"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<text x="64" y="120" font-family="DejaVu Sans, Arial" font-size="24" letter-spacing="5" fill="#2B1B3D">PERSONALISED GIFTS STUDIO</text>
<text x="64" y="230" font-family="DejaVu Sans Condensed, Arial Narrow, Arial" font-weight="bold" font-size="76" fill="#2B1B3D">Your memories,</text>
<text x="64" y="330" font-family="DejaVu Sans Condensed, Arial Narrow, Arial" font-weight="bold" font-size="76" fill="#D6336C">made into gifts.</text>
<text x="64" y="540" font-family="DejaVu Sans, Arial" font-size="28" fill="#6E6378">Pictures Art by Simi · Ships all over India</text>
</svg>`);
const [a, b, c] = await Promise.all([pol(pics[0], -6), pol(pics[1], 4), pol(pics[2], -2)]);
await sharp(text).composite([{ input: a, left: 690, top: 60 }, { input: b, left: 900, top: 120 }, { input: c, left: 760, top: 300 }])
  .jpeg({ quality: 82 }).toFile(new URL('../public/og.jpg', import.meta.url).pathname);
console.log('og.jpg written');
