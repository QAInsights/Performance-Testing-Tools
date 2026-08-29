/* global Buffer, URL */
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { brandIcon } from './brand-mark.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const iconsDir = resolve(root, 'public/icons');

await mkdir(iconsDir, { recursive: true });

const icons = [
  { name: 'icon-192.png', size: 192, padding: 0.06, tiled: true },
  { name: 'icon-512.png', size: 512, padding: 0.06, tiled: true },
  {
    name: 'icon-192-maskable.png',
    size: 192,
    padding: 0.2,
    tiled: false,
  },
  {
    name: 'icon-512-maskable.png',
    size: 512,
    padding: 0.2,
    tiled: false,
  },
];

await Promise.all(
  icons.map(async ({ name, size, padding, tiled }) => {
    const buffer = Buffer.from(brandIcon(size, { padding, tiled }));
    await sharp(buffer)
      .resize(size, size)
      .png()
      .toFile(resolve(iconsDir, name));
  }),
);
