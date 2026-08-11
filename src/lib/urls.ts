import { siteBase, siteOrigin } from '../config/site';

const runtimeBase = () =>
  (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/'
    ? import.meta.env.BASE_URL
    : siteBase
  ).replace(/\/+$/, '');

export function baseUrl(path = ''): string {
  const base = runtimeBase();
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const relativePath =
    cleanPath === base.replace(/^\/+/, '') ||
    cleanPath.startsWith(`${base.replace(/^\/+/, '')}/`)
      ? cleanPath.slice(base.replace(/^\/+/, '').length).replace(/^\/+/, '')
      : cleanPath;
  return relativePath ? `${base}/${relativePath}` : `${base}/`;
}

export function siteUrl(path = ''): string {
  return baseUrl(path);
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${siteOrigin}${baseUrl(path)}`.replace(/\/$/, '');
}
