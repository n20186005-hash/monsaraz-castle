// Compress + rename the gallery for page speed.
// 1) reads  public/gallery/monsaraz-castle (N).jpg   (originals)
// 2) auto-rotates via EXIF, resizes the long edge to 1600px
// 3) re-encodes as progressive mozjpeg q80
// 4) saves as public/gallery/monsaraz-castle-N.jpg and deletes the originals
// Files locked by other processes are skipped (reported at the end).
// Usage: node scripts/optimize-gallery.mjs   (npm run optimize:images)
import { readdirSync, existsSync, renameSync, unlinkSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function deleteWithRetry(path) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      unlinkSync(path);
      return;
    } catch (err) {
      if (attempt === 5) throw err;
      await sleep(600 * attempt);
    }
  }
}

const dir = join(process.cwd(), 'public', 'gallery');
const pattern = /^monsaraz-castle \((\d+)\)\.jpg$/i;

const originals = readdirSync(dir)
  .filter((f) => pattern.test(f))
  .sort((a, b) => {
    const na = Number(a.match(pattern)[1]);
    const nb = Number(b.match(pattern)[1]);
    return na - nb;
  });

if (originals.length === 0) {
  console.log('No "monsaraz-castle (N).jpg" files found. Nothing to do.');
  process.exit(0);
}

let beforeBytes = 0;
let afterBytes = 0;
const leftovers = [];

for (const file of originals) {
  const num = Number(file.match(pattern)[1]);
  const input = join(dir, file);
  const output = join(dir, `monsaraz-castle-${num}.jpg`);
  const tmp = join(dir, `.monsaraz-castle-${num}.tmp.jpg`);

  if (!existsSync(input)) continue;

  try {
    const sizeBefore = statSync(input).size;
    beforeBytes += sizeBefore;

    await sharp(input)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true })
      .toFile(tmp);

    if (existsSync(output)) {
      await deleteWithRetry(output);
    }
    renameSync(tmp, output);
    await deleteWithRetry(input);

    const sizeAfter = statSync(output).size;
    afterBytes += sizeAfter;
    console.log(
      `${file} -> monsaraz-castle-${num}.jpg  ${(sizeBefore / 1024).toFixed(0)} KB -> ${(sizeAfter / 1024).toFixed(0)} KB`
    );
  } catch (err) {
    if (existsSync(tmp)) {
      try {
        unlinkSync(tmp);
      } catch {}
    }
    leftovers.push(file);
    console.warn(`[skip] ${file}: ${err.code || err.message}`);
  }
}

if (leftovers.length > 0) {
  console.log(`\nCould not remove (file in use): ${leftovers.join(', ')}`);
  console.log('Close the program holding the file(s), then re-run: npm run optimize:images');
}
const saved = beforeBytes > 0 ? ((1 - afterBytes / beforeBytes) * 100).toFixed(1) : '0.0';
console.log(
  `\nDone. Total ${(beforeBytes / 1024 / 1024).toFixed(1)} MB -> ${(afterBytes / 1024 / 1024).toFixed(1)} MB  (-${saved}%)`
);
