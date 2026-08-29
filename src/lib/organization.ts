import { absoluteUrl, siteUrl } from './urls';
import { siteOrigin } from '../config/site';
import { datasetLastVerified, tools } from '../data/tools';
import { homeDescription, homeTitle, siteName } from './pageMeta';

/** Public brand graph for Organization / WebSite JSON-LD. */
export const organizationProfile = {
  name: 'QAInsights',
  url: 'https://qainsights.com/',
  sameAs: [
    'https://qainsights.com/',
    'https://github.com/QAInsights',
    'https://www.youtube.com/@QAInsights',
    'https://www.linkedin.com/company/qainsights',
    'https://x.com/QAInsights',
  ],
} as const;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organizationProfile.name,
    url: organizationProfile.url,
    sameAs: [...organizationProfile.sameAs],
  };
}

export function websiteSchema(catalog = tools) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: absoluteUrl(''),
    description: homeDescription(catalog),
    publisher: {
      '@type': 'Organization',
      name: organizationProfile.name,
      url: organizationProfile.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteOrigin}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function datasetSchema(catalog = tools) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: homeTitle(catalog),
    description: homeDescription(catalog),
    url: absoluteUrl(''),
    license: 'https://opensource.org/licenses/MIT',
    creator: {
      '@type': 'Organization',
      name: organizationProfile.name,
      url: organizationProfile.url,
    },
    maintainer: {
      '@type': 'Organization',
      name: 'QAInsights',
      url: 'https://qainsights.com/',
    },
    dateModified: datasetLastVerified,
    keywords: [
      'performance testing',
      'load testing',
      'jmeter',
      'k6',
      'gatling',
      'locust',
    ],
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/plain',
        contentUrl: absoluteUrl('llms.txt'),
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/plain',
        contentUrl: absoluteUrl('llms-full.txt'),
      },
    ],
  };
}

/** Footer / about ecosystem destinations. */
export const ecosystemFooterLinks = [
  { label: 'qainsights.com', href: 'https://qainsights.com/' },
  { label: 'iamspeed.dev', href: 'https://iamspeed.dev/' },
  { label: 'jmeter.ai', href: 'https://jmeter.ai/' },
  { label: 'docs.jmeter.ai', href: 'https://docs.jmeter.ai/' },
  { label: 'plugins.jmeter.ai', href: 'https://plugins.jmeter.ai/' },
  { label: 'ai.dosa.dev', href: 'https://ai.dosa.dev/' },
  {
    label: 'GitHub',
    href: 'https://github.com/QAInsights/Performance-Testing-Tools',
  },
] as const;

export function llmsTxtHref(): string {
  return siteUrl('llms.txt');
}
