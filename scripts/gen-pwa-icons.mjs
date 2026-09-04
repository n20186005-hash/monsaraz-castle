// Rasterize public/icons/icon.svg to PNG sizes required by the PWA manifest.
// Usage: node scripts/gen-pwa-icons.mjs
import { join } from 'node:path';
import sharp from 'sharp';

const iconsDir = join(process.cwd(), 'public', 'icons');
const svg = join(iconsDir, 'icon.svg');

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512 },
];

for (const target of targets) {
  await sharp(svg)
    .resize(target.size, target.size)
    .png({ compressionLevel: 9 })
    .toFile(join(iconsDir, target.name));
  console.log('wrote', target.name);
}
console.log('PWA icons ready.');
