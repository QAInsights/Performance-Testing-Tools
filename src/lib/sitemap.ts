import { datasetLastVerified } from '../data/tools';
import { comparisonByPath } from '../data/comparisons';
import { allLandings } from '../data/landings';
import { reviews } from '../data/reviews';
import { siteBase } from '../config/site';
import { getRawEnrichment } from './enrichmentData';

export function isSitemapPage(page: string, base = siteBase): boolean {
  const pathname = new URL(page).pathname.replace(/\/+$/, '');
  const basePath = base === '/' ? '' : base.replace(/^\/+|\/+$/g, '');
  const relative = (
    basePath &&
    (pathname === `/${basePath}` || pathname.startsWith(`/${basePath}/`))
      ? pathname.slice(basePath.length + 1)
      : pathname
  ).replace(/^\/+/, '');
  return relative !== 'compare' && !/\.[^/]+$/.test(relative);
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
  if (path === '/reviews' || path === '/reviews/') {
    return (
      reviews
        .map((review) => review.reviewedAt)
        .sort()
        .at(-1) || datasetLastVerified
    );
  }
  const reviewMatch = path.match(/^\/reviews\/([^/]+)$/);
  if (reviewMatch) {
    return (
      reviews.find((review) => review.slug === reviewMatch[1])?.reviewedAt ||
      datasetLastVerified
    );
  }
  const vsMatch = path.match(/^\/vs\/([^/]+)$/);
  if (vsMatch) {
    return comparisonByPath(vsMatch[1])?.publishedAt ?? datasetLastVerified;
  }
  const guideMatch = path.match(/^\/guides\/([^/]+)$/);
  if (guideMatch) {
    return (
      allLandings().find(
        (landing) => landing.kind === 'guide' && landing.slug === guideMatch[1],
      )?.publishedAt ?? datasetLastVerified
    );
  }
  if (
    path === '/reports/state-of-performance-tools' ||
    path === '/reports/state-of-performance-tools/'
  ) {
    return '2026-11-27';
  }
  if (!match) return datasetLastVerified;

  return (
    getRawEnrichment(match[1])?.fetchedAt.slice(0, 10) || datasetLastVerified
  );
}
