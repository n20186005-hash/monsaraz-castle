// Pass-2 compression: re-encode public/gallery/monsaraz-castle-N.jpg
// (files are already ~1600px/q80; shrink long edge to 1440px + q78 for faster loads)
import { readdirSync, existsSync, renameSync, unlinkSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const dir = join(process.cwd(), 'public', 'gallery');
const pattern = /^monsaraz-castle-(\d+)\.jpg$/i;
const files = readdirSync(dir)
  .filter((f) => pattern.test(f))
  .sort((a, b) => Number(a.match(pattern)[1]) - Number(b.match(pattern)[1]));

let before = 0;
let after = 0;

for (const file of files) {
  const input = join(dir, file);
  const tmp = join(dir, `.${file}.pass2.tmp`);
  try {
    const sb = statSync(input).size;
    before += sb;
    await sharp(input)
      .rotate()
      .resize({ width: 1440, height: 1440, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toFile(tmp);
    renameSync(tmp, input);
    const sa = statSync(input).size;
    after += sa;
    console.log(`${file}: ${(sb / 1024).toFixed(0)} KB -> ${(sa / 1024).toFixed(0)} KB`);
  } catch (err) {
    console.warn(`[skip] ${file}: ${err.message}`);
    if (existsSync(tmp)) {
      try {
        unlinkSync(tmp);
      } catch {}
    }
  }
}

console.log(
  `\nDone. Total ${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB`
);
