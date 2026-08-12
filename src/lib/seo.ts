import type { Tool } from '../data/tools';
import type { EnrichmentEntry } from './enrichmentData';
import { organizationProfile } from './organization';
import { buildToolFaq, type FaqItem } from './toolFaq';
import { absoluteUrl } from './urls';

export function toolItemList(items: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: absoluteUrl(`tools/${tool.slug}`),
    })),
  };
}

function softwareOffer(tool: Tool) {
  if (tool.license === 'Open Source') {
    return {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    };
  }
  if (tool.license === 'Freemium') {
    return {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available; paid plans for higher capacity',
      availability: 'https://schema.org/InStock',
    };
  }
  return {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      description: 'Contact vendor for pricing',
    },
    description: tool.pricingModel || 'Contact for pricing',
  };
}

export function toolSoftwareApplication(
  tool: Tool,
  enrichment?: EnrichmentEntry,
) {
  const sameAs = [tool.url, tool.repoUrl].filter(
    (url): url is string => Boolean(url),
  );
  const version = enrichment?.latestRelease?.version;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: tool.category,
    operatingSystem: tool.osSupport.join(', ') || undefined,
    description: tool.description,
    url: absoluteUrl(`tools/${tool.slug}`),
    downloadUrl: tool.url,
    softwareVersion: version || undefined,
    offers: softwareOffer(tool),
    author: {
      '@type': 'Organization',
      name: enrichment?.authorOrCompany || tool.vendor,
    },
    publisher: {
      '@type': 'Organization',
      name: organizationProfile.name,
      url: organizationProfile.url,
    },
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function toolFaq(
  tool: Tool,
  catalog: readonly Tool[] = [],
  items?: FaqItem[],
) {
  const faqItems =
    items ??
    buildToolFaq(tool, catalog.length ? catalog : [tool]);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbs(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export {
  organizationSchema,
  websiteSchema,
  datasetSchema,
} from './organization';
