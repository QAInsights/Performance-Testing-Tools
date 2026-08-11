import type { Tool } from '../data/tools';
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

export function toolSoftwareApplication(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: tool.category,
    operatingSystem: tool.osSupport.join(', '),
    description: tool.description,
    url: tool.url,
    offers:
      tool.license === 'Open Source'
        ? { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
        : undefined,
  };
}

export function toolFaq(tool: Tool) {
  const questions = [
    [
      'Is it open source?',
      tool.license === 'Open Source'
        ? `Yes. ${tool.name} is listed as open source.`
        : tool.license === 'Commercial'
          ? `No. ${tool.name} is listed as commercial.`
          : `${tool.name} is listed as freemium.`,
    ],
    [
      'What protocols does it support?',
      tool.protocols.length
        ? `${tool.name} supports ${tool.protocols.join(', ')}.`
        : undefined,
    ],
    [
      'Is it cloud or self-hosted?',
      tool.deployment
        ? `${tool.name} is listed as ${tool.deployment.toLowerCase()}.`
        : undefined,
    ],
    [
      'Is it still maintained?',
      tool.status === 'Active'
        ? `${tool.name} is listed as active.`
        : tool.status === 'Discontinued'
          ? `${tool.name} is listed as discontinued${tool.successor ? `; its successor is ${tool.successor}.` : '.'}`
          : undefined,
    ],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
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
