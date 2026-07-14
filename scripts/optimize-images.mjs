import sharp from "sharp";
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";

const INPUT_DIR = path.join(process.cwd(), "public/images");
const MAX_WIDTH = 1800;
const WEBP_QUALITY = 82;

const mapping = [
  { src: "WhatsApp Image 2026-07-14 at 18.36.47.jpeg", dest: "whispers-green-watercolor" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.47 (1).jpeg", dest: "whispers-green-gouache-1" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48.jpeg", dest: "whispers-green-gouache-2" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (1).jpeg", dest: "traces" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (2).jpeg", dest: "galaxy" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (5).jpeg", dest: "water-in-movement-1" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (6).jpeg", dest: "water-in-movement-2" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (7).jpeg", dest: "weavings" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (8).jpeg", dest: "water-energy" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (11).jpeg", dest: "golden-morning-light" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (3).jpeg", dest: "exhibition-1" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (4).jpeg", dest: "exhibition-2" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (9).jpeg", dest: "exhibition-3" },
  { src: "WhatsApp Image 2026-07-14 at 18.36.48 (10).jpeg", dest: "exhibition-4" },
];

async function optimizeImage(srcFile, destName) {
  const inputPath = path.join(INPUT_DIR, srcFile);
  const outputPath = path.join(INPUT_DIR, `${destName}.webp`);

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  await image
    .rotate()
    .resize({
      width: metadata.width && metadata.width > metadata.height ? MAX_WIDTH : undefined,
      height: metadata.height && metadata.height >= (metadata.width ?? 0) ? MAX_WIDTH : undefined,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(outputPath);

  const inputStats = await sharp(inputPath).metadata();
  const outputStats = await sharp(outputPath).metadata();
  const inputSize = (await import("node:fs/promises")).stat(inputPath);
  const outputSize = (await import("node:fs/promises")).stat(outputPath);

  const inKb = Math.round((await inputSize).size / 1024);
  const outKb = Math.round((await outputSize).size / 1024);

  console.log(
    `✓ ${destName}.webp — ${outputStats.width}×${outputStats.height} — ${inKb}KB → ${outKb}KB`,
  );
}

async function main() {
  for (const { src, dest } of mapping) {
    await optimizeImage(src, dest);
  }

  const files = await readdir(INPUT_DIR);
  for (const file of files) {
    if (file.startsWith("WhatsApp")) {
      await unlink(path.join(INPUT_DIR, file));
      console.log(`Removed source: ${file}`);
    }
  }

  console.log("\nDone — optimized WebP images ready in public/images/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
