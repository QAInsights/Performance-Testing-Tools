import { describe, expect, it } from 'vitest';
import {
  breadcrumbs,
  datasetSchema,
  organizationSchema,
  toolFaq,
  toolItemList,
  toolSoftwareApplication,
  websiteSchema,
} from './seo';
import { absoluteUrl, baseUrl } from './urls';
import { canonicalBase, joinBase, siteBase, siteOrigin } from '../config/site';
import { tools } from '../data/tools';
import { buildToolFaq } from './toolFaq';
import { isSitemapPage } from './sitemap';

describe('SEO structured data', () => {
  it('defaults to the production origin instead of a Vercel deployment URL', () => {
    expect(siteOrigin).toBe('https://perf.jmeter.ai');
    expect(siteOrigin).not.toContain('.vercel.app');
  });

  it('builds absolute URLs with exactly one project base segment', () => {
    for (const path of [
      '',
      '/',
      'tools/grafana-k6',
      '/categories/load-testing/',
    ]) {
      const url = absoluteUrl(path);
      expect(url).toBe(
        `${siteOrigin}${joinBase(path, canonicalBase)}/`.replace(
          `${siteOrigin}//`,
          `${siteOrigin}/`,
        ),
      );
      if (siteBase !== '/') {
        expect(url).not.toContain(`${siteBase}${siteBase}`);
      }
    }
  });

  it('joins base-relative asset URLs with one separator', () => {
    expect(baseUrl('favicon.svg')).toBe(joinBase('favicon.svg'));
    expect(baseUrl('/og/default.png')).toBe(joinBase('og/default.png'));
  });

  it('supports a root deployment without a sub-path segment', () => {
    expect(joinBase('favicon.svg', '/')).toBe('/favicon.svg');
    expect(joinBase('manifest.webmanifest', '/')).toBe('/manifest.webmanifest');
    expect(joinBase('sitemap-index.xml', '/')).toBe('/sitemap-index.xml');
    expect(joinBase('', '/')).toBe('/');
    expect(
      absoluteUrl('about', 'https://performance-testing-tools.vercel.app', '/'),
    ).toBe('https://performance-testing-tools.vercel.app/about/');
    expect(
      absoluteUrl(
        'og/default.png',
        'https://performance-testing-tools.vercel.app',
        '/',
      ),
    ).toBe('https://performance-testing-tools.vercel.app/og/default.png');
  });

  it('keeps page URLs slash-terminated while leaving file URLs unchanged', () => {
    expect(absoluteUrl('')).toBe('https://perf.jmeter.ai/');
    expect(absoluteUrl('about')).toBe('https://perf.jmeter.ai/about/');
    expect(absoluteUrl('og/default.png')).toBe(
      'https://perf.jmeter.ai/og/default.png',
    );
    expect(absoluteUrl('llms.txt')).toBe('https://perf.jmeter.ai/llms.txt');
    expect(absoluteUrl('compare?tools=apache-jmeter,grafana-k6')).toBe(
      'https://perf.jmeter.ai/compare/?tools=apache-jmeter,grafana-k6',
    );
  });

  it('keeps serving paths out of canonical URLs', () => {
    expect(
      absoluteUrl(
        '/foo/tools/grafana-k6',
        'https://example.com',
        canonicalBase,
        '/foo',
      ),
    ).toBe('https://example.com/tools/grafana-k6/');
  });

  it('excludes the empty compare rig from root and sub-path sitemaps', () => {
    expect(isSitemapPage('https://perf.jmeter.ai/compare/')).toBe(false);
    expect(isSitemapPage('https://example.com/foo/compare/', '/foo')).toBe(
      false,
    );
    expect(isSitemapPage('https://example.com/foo/about/', '/foo')).toBe(true);
  });

  it('serializes valid JSON-LD for directory and tool records', () => {
    const tool = tools[0];
    for (const value of [
      toolItemList(tools),
      toolSoftwareApplication(tool, {
        fetchedAt: '2026-01-01',
        latestRelease: { version: '1.0.0' },
      }),
      toolFaq(tool, tools, buildToolFaq(tool, tools)),
      breadcrumbs([{ name: 'Directory', path: '' }]),
      websiteSchema(),
      organizationSchema(),
      datasetSchema(),
    ]) {
      expect(() => JSON.parse(JSON.stringify(value))).not.toThrow();
    }
  });

  it('includes SearchAction and Organization sameAs', () => {
    const site = websiteSchema();
    expect(site.potentialAction['@type']).toBe('SearchAction');
    expect(site.potentialAction.target.urlTemplate).toContain('?q=');
    const org = organizationSchema();
    expect(org.sameAs).toContain('https://github.com/QAInsights');
  });

  it('uses free offer for open source and contact pricing for commercial', () => {
    const oss = tools.find((tool) => tool.license === 'Open Source')!;
    const commercial = tools.find((tool) => tool.license === 'Commercial')!;
    expect(toolSoftwareApplication(oss).offers.price).toBe('0');
    expect(toolSoftwareApplication(commercial).offers.price).toBeUndefined();
    expect(
      toolSoftwareApplication(commercial).offers.description ||
        toolSoftwareApplication(commercial).offers.priceSpecification,
    ).toBeTruthy();
  });
});
