import { datasetLastVerified } from '../data/tools';
import { siteBase } from '../config/site';
import { getRawEnrichment } from './enrichmentData';

export function isSitemapPage(page: string, base = siteBase): boolean {
  const pathname = new URL(page).pathname.replace(/\/+$/, '');
  const basePath = base === '/' ? '' : base;
  return pathname !== `${basePath}/compare`;
}

export function sitemapLastmod(page: string, base = siteBase): string {
  const pathname = new URL(page).pathname.replace(/\/+$/, '');
  const basePath = base === '/' ? '' : base.replace(/^\/+|\/+$/g, '');
  const path =
    basePath &&
    (pathname === `/${basePath}` || pathname.startsWith(`/${basePath}/`))
      ? pathname.slice(basePath.length + 1)
      : pathname;
  const match = path.match(/^\/tools\/([^/]+)$/);
  if (!match) return datasetLastVerified;

  return (
    getRawEnrichment(match[1])?.fetchedAt.slice(0, 10) || datasetLastVerified
  );
}
