import { canonicalBase, joinBase, siteBase, siteOrigin } from '../config/site';

const runtimeBase = () =>
  (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/'
    ? import.meta.env.BASE_URL
    : siteBase
  ).replace(/\/+$/, '');

export function baseUrl(path = ''): string {
  return joinBase(path, runtimeBase() || '/');
}

export function siteUrl(path = ''): string {
  return baseUrl(path);
}

export function absoluteUrl(
  path: string,
  origin = siteOrigin,
  base = canonicalBase,
  servingBase = runtimeBase() || '/',
): string {
  if (path.startsWith('http')) return path;
  const servingSegment = servingBase.replace(/^\/+|\/+$/g, '');
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const canonicalPath =
    servingSegment &&
    (cleanPath === servingSegment || cleanPath.startsWith(`${servingSegment}/`))
      ? cleanPath.slice(servingSegment.length).replace(/^\/+/, '')
      : cleanPath;
  return `${origin}${joinBase(canonicalPath, base)}`.replace(/\/$/, '');
}
