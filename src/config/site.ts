const environment = typeof process === 'undefined' ? {} : process.env;
const defaultOrigin = 'https://perf.jmeter.ai';
const defaultBase = '/';

const configuredOrigin =
  environment.SITE_ORIGIN ||
  (environment.VERCEL_URL
    ? `https://${environment.VERCEL_URL}`
    : defaultOrigin);
const configuredBase = environment.SITE_BASE ?? defaultBase;

export const siteOrigin = configuredOrigin.replace(/\/+$/, '');
export const siteBase =
  configuredBase === '/' || configuredBase === ''
    ? '/'
    : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;
export const canonicalBase = siteBase;

export function joinBase(path = '', base = siteBase): string {
  const normalizedBase = base === '/' ? '' : base.replace(/^\/+|\/+$/g, '');
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const relativePath =
    normalizedBase &&
    (cleanPath === normalizedBase || cleanPath.startsWith(`${normalizedBase}/`))
      ? cleanPath.slice(normalizedBase.length).replace(/^\/+/, '')
      : cleanPath;

  if (!normalizedBase) return relativePath ? `/${relativePath}` : '/';
  return relativePath
    ? `/${normalizedBase}/${relativePath}`
    : `/${normalizedBase}/`;
}
