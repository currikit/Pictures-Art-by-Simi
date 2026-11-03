import type { ImageMetadata } from 'astro';

// ---------------------------------------------------------------------------
// Everything Simi may want to change lives in this one file.
// Lines marked `placeholder: true` (or values of null) are waiting for her
// real details. Search for "placeholder" before launch.
// ---------------------------------------------------------------------------

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/products/*.jpg', { eager: true });
export const img = (file: string): ImageMetadata => {
  const hit = images[`../assets/products/${file}`];
  if (!hit) throw new Error(`Missing image: ${file}`);
  return hit.default;
};

export const site = {
  name: 'Pictures Art by Simi',
  legalName: 'Pictures art ~BY SIMI',
  tagline: 'Your photos, made into gifts.',
  description:
    'Handmade personalised gifts from Mumbai: caricatures, photo frames, resin keychains, magnets and hampers. Ships all over India. Order on WhatsApp.',
  whatsapp: '919925679329',
  whatsappDisplay: '+91 99256 79329',
  email: 'picturesart549@gmail.com',
  instagram: 'https://www.instagram.com/pics_craft66/',
  instagramHandle: '@pics_craft66',
  city: 'Mumbai, Maharashtra',
  ships: 'Ships all over India',
  domain: { value: 'simipicsart.in', placeholder: true },
};

// Prefix internal links with the site's folder (empty at a domain root, '/Repo-Name' on GitHub Pages).
export const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
export const u = (path: string) => `${BASE}${path}`;

export const wa = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export type Occasion = { slug: string; name: string };
export const occasions: Occasion[] = [
  { slug: 'birthday', name: 'Birthday' },
  { slug: 'anniversary', name: 'Anniversary' },
  { slug: 'valentines', name: "Valentine's" },
  { slug: 'rakhi', name: 'Rakhi' },
  { slug: 'fathers-day', name: "Father's Day" },
  { slug: 'friendship', name: 'Friendship' },
  { slug: 'just-because', name: 'Just because' },
];

export const recipients = [
  { slug: 'her', name: 'For her' },
  { slug: 'him', name: 'For him' },
  { slug: 'couple', name: 'For couples' },
  { slug: 'parents', name: 'For parents' },
  { slug: 'besties', name: 'For besties' },
  { slug: 'siblings', name: 'For siblings' },
];

export const categories = [
  { slug: 'hampers', name: 'Hampers' },
  { slug: 'caricatures', name: 'Caricatures' },
  { slug: 'frames', name: 'Frames' },
  { slug: 'keychains', name: 'Keychains' },
  { slug: 'magnets', name: 'Fridge magnets' },
  { slug: 'cards', name: 'Cards' },
  { slug: 'collectibles', name: 'Collectibles' },
];

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  occasions: string[];
  for: string[];
  blurb: string;
  customise: string[];
  /** "from" price in rupees; null = waiting for Simi's price */
  priceFrom: number | null;
  /** making time in days; null = waiting for Simi */
  makingDays: number | null;
  photoUpload: boolean;
  bestSeller?: boolean;
};

export const products: Product[] = [
  {
    slug: 'birthday-girly-hamper-box', name: 'Birthday girly hamper box', category: 'hampers',
    image: '03-birthday-girly-hamper-box.jpg', alt: 'Pink birthday hamper box with makeup, scrunchies, a satin bow and flowers',
    occasions: ['birthday'], for: ['her', 'besties'],
    blurb: 'An overloaded box of makeup, scrunchies, accessories and little treats, packed by hand under a Happy Birthday banner.',
    customise: ['Items inside', 'Name tag', 'Colour theme'], priceFrom: null, makingDays: null, photoUpload: false, bestSeller: true,
  },
  {
    slug: 'snack-hamper', name: 'Colour theme snack hamper', category: 'hampers',
    image: '05-rakhi-evil-eye-hamper.jpg', alt: 'Clear acrylic tote packed with chips, chocolates and an evil eye theme',
    occasions: ['rakhi', 'birthday', 'friendship'], for: ['siblings', 'him', 'besties'],
    blurb: 'A clear acrylic tote packed with snacks and small gifts in one colour theme, first made for Rakhi.',
    customise: ['Theme colour', 'Snacks', 'Photo card'], priceFrom: 199, makingDays: null, photoUpload: true, bestSeller: true,
  },
  {
    slug: 'brother-rakhi-hamper', name: 'Pamper your brother hamper', category: 'hampers',
    image: '06-rakhi-brother-hamper.jpg', alt: 'Rakhi hamper in a clear tote with snacks, a rakhi card and a photo',
    occasions: ['rakhi'], for: ['siblings', 'him'],
    blurb: 'Snacks, a rakhi and a photo of the two of you, ready to hand over.',
    customise: ['Snacks', 'Photo', 'Message card'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'love-story-kit', name: 'Our love story kit', category: 'hampers',
    image: '20-love-story-hamper-kit.jpg', alt: 'Couple gift kit with a love story timeline frame, polaroids, cards, chocolate and a keychain',
    occasions: ['anniversary', 'valentines'], for: ['couple'],
    blurb: 'A timeline frame of how you met, polaroids, pun cards, chocolate and a keychain in one kit.',
    customise: ['Names and dates', 'Photos', 'Card messages'], priceFrom: null, makingDays: null, photoUpload: true, bestSeller: true,
  },
  {
    slug: 'couple-caricature-canvas', name: 'Couple caricature canvas', category: 'caricatures',
    image: '23-couple-caricature-canvas.jpg', alt: 'Hand-illustrated caricature of a couple on a canvas board',
    occasions: ['anniversary', 'valentines', 'birthday'], for: ['couple'],
    blurb: 'Your photo redrawn as an illustration and printed on canvas board, with a line of your choice.',
    customise: ['Photo', 'Quote', 'Background colour'], priceFrom: null, makingDays: null, photoUpload: true, bestSeller: true,
  },
  {
    slug: 'friends-caricature-canvas', name: 'Besties caricature canvas', category: 'caricatures',
    image: '25-sisters-caricature-canvas.jpg', alt: 'Illustrated caricature of two young women on a canvas board',
    occasions: ['birthday', 'friendship'], for: ['besties', 'siblings', 'her'],
    blurb: 'Two of you, drawn from a favourite photo and printed on canvas board.',
    customise: ['Photo', 'Background'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'framed-caricature', name: 'Framed caricature', category: 'caricatures',
    image: '27-caricature-frame.jpg', alt: 'Illustrated portrait of two women in a white frame',
    occasions: ['birthday', 'friendship', 'just-because'], for: ['her', 'besties', 'siblings'],
    blurb: 'An illustrated portrait in a white frame, ready for a desk or a wall.',
    customise: ['Photo', 'Frame colour'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'gingham-polaroid-frame', name: 'Gingham polaroid frame', category: 'frames',
    image: '04-black-gingham-frames.jpg', alt: 'Black frames with gingham mounts holding polaroid group photos',
    occasions: ['friendship', 'birthday', 'just-because'], for: ['besties'],
    blurb: 'A black frame with a gingham mount around one polaroid print, with a small heart and bow.',
    customise: ['Photo', 'Caption'], priceFrom: null, makingDays: null, photoUpload: true, bestSeller: true,
  },
  {
    slug: 'vintage-scrapbook-frame', name: 'Vintage scrapbook frame', category: 'frames',
    image: '08-vintage-scrapbook-frame.jpg', alt: 'Gold frame filled with photos, dried flowers, stickers and handwritten notes',
    occasions: ['birthday', 'anniversary', 'friendship'], for: ['her', 'besties', 'couple'],
    blurb: 'A golden frame layered like a scrapbook: your photos, flowers, notes and little stickers.',
    customise: ['Photos', 'Notes', 'Colours'], priceFrom: null, makingDays: null, photoUpload: true, bestSeller: true,
  },
  {
    slug: 'photo-collage-frame', name: 'Photo collage frame', category: 'frames',
    image: '29-photo-collage-frame.jpg', alt: 'White frame with a black and white collage of portraits',
    occasions: ['birthday', 'just-because'], for: ['him', 'her'],
    blurb: 'Several photos arranged into one clean collage in a white frame.',
    customise: ['Photos', 'Colour or black and white'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'car-display-frame', name: '3D car frame', category: 'frames',
    image: '21-3d-car-frame.jpg', alt: 'Dark shadow box frame with a model car breaking through a textured wall',
    occasions: ['birthday', 'just-because'], for: ['him'],
    blurb: 'A shadow box with a model car bursting out of a textured wall. For the car lover.',
    customise: ['Car model', 'Name plate'], priceFrom: null, makingDays: null, photoUpload: false,
  },
  {
    slug: 'racing-car-display-frame', name: 'Racing car display frame', category: 'frames',
    image: '17-racing-car-display-frame.jpg', alt: 'Display frame holding a row of model racing cars',
    occasions: ['birthday', 'just-because'], for: ['him'],
    blurb: 'A lit display frame for a row of model racing cars, made with a die-cast collector partner.',
    customise: ['Cars', 'Background'], priceFrom: null, makingDays: null, photoUpload: false,
  },
  {
    slug: 'resin-flower-keychain', name: 'Resin flower keychain', category: 'keychains',
    image: '19-resin-flower-keychain.jpg', alt: 'Round clear resin keychain with pressed flowers, silver flakes and a small photo',
    occasions: ['birthday', 'friendship', 'just-because'], for: ['her', 'besties'],
    blurb: 'Real pressed flowers, silver flakes and a tiny photo set in clear resin, with a word of your choice.',
    customise: ['Photo', 'Word', 'Flowers'], priceFrom: null, makingDays: null, photoUpload: true, bestSeller: true,
  },
  {
    slug: 'resin-heart-keychain', name: 'Resin heart keychain', category: 'keychains',
    image: '07-resin-heart-keychain.jpg', alt: 'Heart-shaped resin keychain with a group photo and a sunflower',
    occasions: ['friendship', 'valentines', 'just-because'], for: ['besties', 'couple'],
    blurb: 'A heart of clear resin with your photo and a flower inside. Many more designs on request.',
    customise: ['Photo', 'Shape', 'Flowers'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'resin-photo-keychain', name: 'Polaroid resin keychain', category: 'keychains',
    image: '22-resin-photo-keychains.jpg', alt: 'Square clear resin keychains holding polaroid-style photos',
    occasions: ['friendship', 'birthday'], for: ['besties', 'siblings'],
    blurb: 'Mini polaroid prints sealed in clear resin, made in pairs for best friends.',
    customise: ['Photos', 'Gold flakes'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'postcard-keychain', name: 'Postcard keychain', category: 'keychains',
    image: '30-postcard-keychain.jpg', alt: 'Small envelope-shaped keychain with a red heart seal and a postcard inside',
    occasions: ['valentines', 'friendship', 'just-because'], for: ['couple', 'besties'],
    blurb: 'A tiny envelope with a heart seal that opens to a postcard message.',
    customise: ['Message'], priceFrom: null, makingDays: null, photoUpload: false,
  },
  {
    slug: 'filmy-polaroid-magnet', name: 'Filmy polaroid magnet', category: 'magnets',
    image: '09-filmy-polaroid-magnets.jpg', alt: 'Fridge magnet shaped like a polaroid with a film strip border',
    occasions: ['birthday', 'just-because'], for: ['her', 'besties'],
    blurb: 'Your photo in a film-strip polaroid, made to hold on the fridge. Good for gifting or your own home.',
    customise: ['Photo', 'Caption'], priceFrom: null, makingDays: null, photoUpload: true, bestSeller: true,
  },
  {
    slug: 'wavy-fridge-magnets', name: 'Wavy fridge magnets', category: 'magnets',
    image: '15-wavy-fridge-magnets.jpg', alt: 'Three wavy-edged photo fridge magnets in red, purple and pink',
    occasions: ['birthday', 'friendship'], for: ['her', 'besties'],
    blurb: 'Bright wavy frames for your favourite photos, in a colour set of your choice.',
    customise: ['Photos', 'Colours'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'best-dad-magnet', name: 'Best Dad magnet', category: 'magnets',
    image: '11-fathers-day-photo-stand.jpg', alt: 'Wooden "best dad ever" magnet with two heart photo windows',
    occasions: ['fathers-day', 'birthday'], for: ['parents', 'him'],
    blurb: 'A wooden "best dad ever" piece with your photos in two hearts.',
    customise: ['Photos'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'illustrated-wallet-card', name: 'Illustrated wallet card', category: 'cards',
    image: '18-illustrated-wallet-card.jpg', alt: 'Wallet card with an illustrated couple and a short love line',
    occasions: ['valentines', 'anniversary'], for: ['couple'],
    blurb: 'A card-sized illustration of the two of you that fits in a wallet.',
    customise: ['Photo', 'Line of text'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'distance-map-wallet-card', name: 'Distance map wallet card', category: 'cards',
    image: '28-distance-map-wallet-card.jpg', alt: 'Wallet card showing a map between two cities with an illustrated couple',
    occasions: ['valentines', 'anniversary'], for: ['couple'],
    blurb: 'Your two cities on a map with a dotted heart between them. Made for long-distance couples.',
    customise: ['Two cities', 'Photo', 'Names'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'magazine-cover-print', name: 'Magazine cover print', category: 'cards',
    image: '14-best-dad-magazine-cover.jpg', alt: 'Magazine-style cover print titled Best Dad with a father and daughter photo',
    occasions: ['fathers-day', 'birthday'], for: ['parents', 'him'],
    blurb: 'Put someone on the cover: a magazine-style print with their photo and your own headlines.',
    customise: ['Photo', 'Headlines'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'fathers-day-card', name: "Father's Day keepsake card", category: 'cards',
    image: '31-fathers-day-card.jpg', alt: "Father's Day card with a bow, an envelope sticker and a camera photo frame",
    occasions: ['fathers-day'], for: ['parents'],
    blurb: 'A layered keepsake card with a camera-shaped photo window and a list of everything he is.',
    customise: ['Photo', 'Words'], priceFrom: null, makingDays: null, photoUpload: true,
  },
  {
    slug: 'collectible-mini-figures', name: 'Collectible mini figures', category: 'collectibles',
    image: '01-collectible-mini-figures.jpg', alt: 'A set of small collectible wizard-themed figures on a dark rug',
    occasions: ['birthday', 'just-because'], for: ['him', 'her'],
    blurb: 'Limited sets of collectible mini toy figures from international releases. Ask on WhatsApp what is in stock.',
    customise: [], priceFrom: null, makingDays: null, photoUpload: false,
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const priceLabel = (p: Product) => (p.priceFrom ? `from ₹${p.priceFrom}` : 'Ask for price');

// Hamper builder: prices are placeholders until Simi shares them.
export const hamperBoxes = [
  { id: 'small', name: 'Small box', note: 'Holds 3 to 4 items', placeholder: true },
  { id: 'medium', name: 'Medium box', note: 'Holds 5 to 7 items', placeholder: true },
  { id: 'overloaded', name: 'Overloaded box', note: 'Holds 8 or more items', placeholder: true },
  { id: 'tote', name: 'Clear acrylic tote', note: 'Snack hampers', placeholder: true },
];

export const hamperItems = [
  { id: 'photo-prints', name: 'Polaroid photo prints', group: 'Personal' },
  { id: 'magnet', name: 'Photo fridge magnet', group: 'Personal' },
  { id: 'keychain', name: 'Resin keychain', group: 'Personal' },
  { id: 'mini-frame', name: 'Mini photo frame', group: 'Personal' },
  { id: 'wallet-card', name: 'Wallet card', group: 'Personal' },
  { id: 'note', name: 'Handwritten note', group: 'Personal' },
  { id: 'chocolates', name: 'Chocolates', group: 'Treats' },
  { id: 'snacks', name: 'Chips and snacks', group: 'Treats' },
  { id: 'sweets', name: 'Mithai box', group: 'Treats' },
  { id: 'scrunchies', name: 'Scrunchies', group: 'Little things' },
  { id: 'makeup', name: 'Makeup pouch', group: 'Little things' },
  { id: 'flowers', name: 'Artificial flowers', group: 'Little things' },
  { id: 'evil-eye', name: 'Evil eye charm', group: 'Little things' },
  { id: 'rakhi', name: 'Rakhi', group: 'Little things' },
];

export const reviews = {
  voiceNote: { caption: 'One of the best feedback ever', length: null, audio: null, placeholder: true },
  screenshots: [
    { placeholder: true, note: 'Review screenshot from her Reviews highlight' },
    { placeholder: true, note: 'Review screenshot from her Reviews highlight' },
    { placeholder: true, note: 'Review screenshot from her Reviews highlight' },
  ],
  reels: [
    'https://www.instagram.com/reel/DanbiiaNqMg/',
    'https://www.instagram.com/reel/Das89pcOTrF/',
    'https://www.instagram.com/reel/DcEnvGwuPIQ/',
  ],
};

export const faqs = [
  { q: 'How do I order?', a: 'Pick a gift or describe your idea, then message Simi on WhatsApp with your photos, names and the date you need it. She confirms the price and timing before starting.' },
  { q: 'Do you ship outside Mumbai?', a: 'Yes, every order can be shipped anywhere in India.' },
  { q: 'How long does it take?', a: 'Each piece is made by hand after you order. [Making time per product: waiting for Simi.]', placeholder: true },
  { q: 'What does delivery cost?', a: '[Delivery charges and courier: waiting for Simi.]', placeholder: true },
  { q: 'How do I pay?', a: '[Payment methods, for example UPI: waiting for Simi.]', placeholder: true },
  { q: 'Can I cancel an order?', a: 'No. Every gift is made to order for one person, so orders cannot be cancelled once Simi starts making them.' },
  { q: 'What if it arrives damaged?', a: '[Damage and replacement policy: waiting for Simi.]', placeholder: true },
  { q: 'Can I see it before you ship?', a: 'Ask on WhatsApp. [Whether Simi shares a preview photo: waiting for Simi.]', placeholder: true },
];
