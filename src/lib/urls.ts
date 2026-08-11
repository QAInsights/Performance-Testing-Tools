import { joinBase, siteBase, siteOrigin } from '../config/site';

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
  base = runtimeBase() || '/',
): string {
  if (path.startsWith('http')) return path;
  return `${origin}${joinBase(path, base)}`.replace(/\/$/, '');
}
