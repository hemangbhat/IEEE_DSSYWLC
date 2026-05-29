/**
 * One-off image optimizer.
 *
 * - Recompresses every JPG/JPEG under public/gallery in place
 *   (max width 1600px, quality 80, mozjpeg). Same paths, no code change.
 * - Converts the hero background public/logos/image.png -> image.webp.
 *
 * Run:  node scripts/optimize-images.mjs
 *
 * Originals are recoverable via git until you commit.
 */

import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const GALLERY_DIR = join(ROOT, "public", "gallery");

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 80;

function kb(bytes) {
  return (bytes / 1024).toFixed(0);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

async function optimizeJpeg(file) {
  const input = await readFile(file);
  const before = input.length;

  const output = await sharp(input)
    .rotate() // respect EXIF orientation before stripping metadata
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  // Only overwrite if we actually saved space.
  if (output.length < before) {
    await writeFile(file, output);
    return { before, after: output.length, changed: true };
  }
  return { before, after: before, changed: false };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;

  const files = (await walk(GALLERY_DIR)).filter((f) =>
    [".jpg", ".jpeg"].includes(extname(f).toLowerCase()),
  );

  console.log(`Optimizing ${files.length} gallery images...\n`);

  for (const file of files) {
    const rel = file.replace(ROOT + "\\", "").replace(ROOT + "/", "");
    try {
      const { before, after, changed } = await optimizeJpeg(file);
      totalBefore += before;
      totalAfter += after;
      console.log(
        `${changed ? "✓" : "–"} ${rel.padEnd(45)} ${kb(before).padStart(6)}KB -> ${kb(after).padStart(6)}KB`,
      );
    } catch (err) {
      console.error(`✗ ${rel}: ${err.message}`);
    }
  }

  // Hero background: PNG -> WebP
  const heroPng = join(ROOT, "public", "logos", "image.png");
  try {
    const stats = await stat(heroPng);
    const buf = await readFile(heroPng);
    const webp = await sharp(buf)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const heroWebp = join(ROOT, "public", "logos", "image.webp");
    await writeFile(heroWebp, webp);
    console.log(
      `\n✓ hero image.png -> image.webp  ${kb(stats.size)}KB -> ${kb(webp.length)}KB`,
    );
    totalBefore += stats.size;
    totalAfter += webp.length;
  } catch (err) {
    console.error(`\n✗ hero image: ${err.message}`);
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB ` +
      `(saved ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
