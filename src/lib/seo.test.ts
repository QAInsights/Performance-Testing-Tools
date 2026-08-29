import { describe, expect, it, vi } from 'vitest';
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
import { datasetLastVerified, tools } from '../data/tools';
import { buildToolFaq } from './toolFaq';
import { isSitemapPage, sitemapLastmod } from './sitemap';
import { curatorPerson } from './methodology';

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
    expect(isSitemapPage('https://perf.jmeter.ai/tools/apache-jmeter.md')).toBe(
      false,
    );
  });

  it('resolves sitemap lastmod dates from enrichment with dataset fallback', () => {
    expect(sitemapLastmod('https://perf.jmeter.ai/tools/apache-jmeter/')).toBe(
      '2026-08-11',
    );
    expect(sitemapLastmod('https://perf.jmeter.ai/about/')).toBe(
      datasetLastVerified,
    );
    expect(
      sitemapLastmod('https://example.com/foo/tools/apache-jmeter/', '/foo'),
    ).toBe('2026-08-11');
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

  it('adds entity signals without fabricated ratings', () => {
    const tool = tools.find((item) => item.slug === 'apache-jmeter')!;
    const enrichment = {
      fetchedAt: '2026-01-01T00:00:00.000Z',
      features: ['Distributed testing'],
    };
    const application = toolSoftwareApplication(tool, enrichment);
    expect(application.image).toBe(
      'https://perf.jmeter.ai/og/apache-jmeter.png',
    );
    expect(application.dateModified).toBe('2026-01-01');
    expect(application.applicationSubCategory).toBe(tool.category);
    expect(application.featureList).toEqual(['Distributed testing']);
    expect(application.softwareRequirements).toBe(tool.protocols.join(', '));
    expect(application.keywords).toContain(tool.name);
    expect(application.isPartOf).toEqual({
      '@type': 'WebSite',
      name: 'Performance Testing Tools',
      url: 'https://perf.jmeter.ai/',
    });
    expect(application.author).toEqual({
      '@type': 'Organization',
      name: 'Apache Software Foundation',
    });
    expect(application.author.name).toBe(tool.vendor);
    expect(application.publisher).toEqual({
      '@type': 'Organization',
      name: 'Apache Software Foundation',
    });
    expect(application).not.toHaveProperty('creator');
    expect(application).not.toHaveProperty('aggregateRating');
    expect(datasetSchema()).toMatchObject({
      creator: [
        {
          '@type': 'Organization',
          name: 'QAInsights',
          url: 'https://qainsights.com/',
        },
        { '@type': 'Person', ...curatorPerson },
      ],
      maintainer: {
        '@type': 'Organization',
        name: 'QAInsights',
        url: 'https://qainsights.com/',
      },
      author: { '@type': 'Person', ...curatorPerson },
    });
    expect(toolFaq(tool, tools).author).toEqual({
      '@type': 'Person',
      ...curatorPerson,
    });
    expect(toolFaq(tool, tools).publisher).toEqual({
      '@type': 'Organization',
      name: 'QAInsights',
      url: 'https://qainsights.com/',
    });
    expect(toolFaq(tool, tools, undefined, enrichment).dateModified).toBe(
      '2026-01-01',
    );
    expect(toolFaq(tool, tools).dateModified).toBe(datasetLastVerified);
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

describe('canonical origin environment precedence', () => {
  type ControlledEnvironment = {
    SITE_ORIGIN?: string;
    VERCEL_URL?: string;
  };

  async function loadSiteOrigin(environment: ControlledEnvironment) {
    const previous = {
      SITE_ORIGIN: process.env.SITE_ORIGIN,
      VERCEL_URL: process.env.VERCEL_URL,
    };

    if (environment.SITE_ORIGIN === undefined) {
      delete process.env.SITE_ORIGIN;
    } else {
      process.env.SITE_ORIGIN = environment.SITE_ORIGIN;
    }

    if (environment.VERCEL_URL === undefined) {
      delete process.env.VERCEL_URL;
    } else {
      process.env.VERCEL_URL = environment.VERCEL_URL;
    }

    try {
      vi.resetModules();
      const site = await import('../config/site');
      return site.siteOrigin;
    } finally {
      if (previous.SITE_ORIGIN === undefined) {
        delete process.env.SITE_ORIGIN;
      } else {
        process.env.SITE_ORIGIN = previous.SITE_ORIGIN;
      }

      if (previous.VERCEL_URL === undefined) {
        delete process.env.VERCEL_URL;
      } else {
        process.env.VERCEL_URL = previous.VERCEL_URL;
      }

      vi.resetModules();
    }
  }

  it('keeps the production origin when only VERCEL_URL is set', async () => {
    const origin = await loadSiteOrigin({
      VERCEL_URL: 'preview-project.vercel.app',
    });

    expect(origin).toBe('https://perf.jmeter.ai');
    expect(origin).not.toContain('.vercel.app');
  });

  it('uses SITE_ORIGIN and strips trailing slashes', async () => {
    const origin = await loadSiteOrigin({
      SITE_ORIGIN: 'https://alternate.example///',
      VERCEL_URL: 'preview-project.vercel.app',
    });

    expect(origin).toBe('https://alternate.example');
  });

  it('does not let VERCEL_URL override an explicit SITE_ORIGIN', async () => {
    const origin = await loadSiteOrigin({
      SITE_ORIGIN: 'https://alternate.example',
      VERCEL_URL: 'production-project.vercel.app',
    });

    expect(origin).toBe('https://alternate.example');
    expect(origin).not.toContain('production-project.vercel.app');
  });
});
