import { describe, expect, it } from 'vitest';
import {
  breadcrumbs,
  toolFaq,
  toolItemList,
  toolSoftwareApplication,
} from './seo';
import { absoluteUrl, baseUrl } from './urls';
import { joinBase, siteBase, siteOrigin } from '../config/site';
import { tools } from '../data/tools';

describe('SEO structured data', () => {
  it('builds absolute URLs with exactly one project base segment', () => {
    for (const path of [
      '',
      '/',
      'tools/grafana-k6',
      '/categories/load-testing/',
    ]) {
      const url = absoluteUrl(path);
      expect(url).toBe(`${siteOrigin}${joinBase(path)}`.replace(/\/$/, ''));
      if (siteBase !== '/') {
        expect(url).not.toContain(`${siteBase}${siteBase}`);
      }
    }
  });

  it('joins base-relative asset URLs with one separator', () => {
    expect(baseUrl('favicon.svg')).toBe(joinBase('favicon.svg'));
    expect(baseUrl('/og/default.png')).toBe(joinBase('og/default.png'));
  });

  it('supports a root deployment without a Pages segment', () => {
    expect(joinBase('favicon.svg', '/')).toBe('/favicon.svg');
    expect(joinBase('manifest.webmanifest', '/')).toBe('/manifest.webmanifest');
    expect(joinBase('sitemap-index.xml', '/')).toBe('/sitemap-index.xml');
    expect(joinBase('', '/')).toBe('/');
    expect(
      absoluteUrl('about', 'https://performance-testing-tools.vercel.app', '/'),
    ).toBe('https://performance-testing-tools.vercel.app/about');
    expect(
      absoluteUrl(
        'og/default.png',
        'https://performance-testing-tools.vercel.app',
        '/',
      ),
    ).toBe('https://performance-testing-tools.vercel.app/og/default.png');
  });

  it('serializes valid JSON-LD for directory and tool records', () => {
    for (const value of [
      toolItemList(tools),
      toolSoftwareApplication(tools[0]),
      toolFaq(tools[0]),
      breadcrumbs([{ name: 'Directory', path: '' }]),
    ]) {
      expect(() => JSON.parse(JSON.stringify(value))).not.toThrow();
    }
  });
});
