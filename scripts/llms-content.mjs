/** Web manifest builder kept separate from the Astro-backed content mirrors. */

export function buildWebManifest(basePath = '/') {
  const base =
    basePath === '/' || basePath === ''
      ? '/'
      : `/${basePath.replace(/^\/+|\/+$/g, '')}/`;
  const icon = (name) => `${base === '/' ? '/' : base}icons/${name}`;

  return `${JSON.stringify(
    {
      name: 'Performance Testing Tools',
      short_name: 'Perf Tools',
      description:
        'A curated directory of performance testing tools from QAInsights.',
      start_url: base,
      scope: base,
      display: 'standalone',
      background_color: '#0A0A0A',
      theme_color: '#0A0A0A',
      icons: [
        {
          src: icon('icon-192.png'),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: icon('icon-512.png'),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: icon('icon-192-maskable.png'),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: icon('icon-512-maskable.png'),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    null,
    2,
  )}\n`;
}
