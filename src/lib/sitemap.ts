import { siteBase } from '../config/site';

export function isSitemapPage(page: string, base = siteBase): boolean {
  const pathname = new URL(page).pathname.replace(/\/+$/, '');
  const basePath = base === '/' ? '' : base;
  return pathname !== `${basePath}/compare`;
}
