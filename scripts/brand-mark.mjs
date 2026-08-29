/** Ramp mark from public/favicon.svg, drawn on a 64x64 grid. */
const bars = `<rect x="12" y="40" width="10" height="12" rx="3" fill="#007F7C"/><rect x="24" y="32" width="10" height="20" rx="3" fill="#18A09B"/><rect x="36" y="22" width="10" height="30" rx="3" fill="#70D3CB"/><path d="M14 22l12-8 10 5 10-8" fill="none" stroke="#FBB03B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;

const tile = `<rect x="1.5" y="1.5" width="61" height="61" rx="14" fill="#101313" stroke="#007F7C" stroke-width="3"/>`;

/** Tiled mark placed at (x, y) and scaled to `size` px, for embedding in a larger SVG. */
export function brandMark(x, y, size) {
  return `<g transform="translate(${x} ${y}) scale(${size / 64})">${tile}${bars}</g>`;
}

/** Standalone square icon. Untiled marks are fitted to their 44x44 artwork box. */
export function brandIcon(size, { padding = 0, tiled = true } = {}) {
  const inner = size * (1 - 2 * padding);
  const offset = size * padding;
  const transform = tiled
    ? `translate(${offset} ${offset}) scale(${inner / 64})`
    : `translate(${offset} ${offset}) scale(${inner / 44}) translate(-8 -8)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#0A0A0A"/><g transform="${transform}">${tiled ? tile : ''}${bars}</g></svg>`;
}
