import { describe, expect, it } from 'vitest';
import {
  buildRssFeed,
  escapeXml,
  rssDate,
  type FeedChannel,
  type FeedItem,
} from './feed';
import { isSitemapPage } from './sitemap';

const channel: FeedChannel = {
  title: 'Performance Testing Tools',
  link: 'https://perf.jmeter.ai/',
  description: 'A curated directory of performance testing tools.',
  lastBuildDate: '2026-09-18',
  selfLink: 'https://perf.jmeter.ai/feed.xml',
};

const items: FeedItem[] = [
  {
    title: 'Old item',
    link: 'https://perf.jmeter.ai/reviews/wrk/',
    description: 'Old review.',
    pubDate: '2026-09-17',
  },
  {
    title: 'New item & <special> "chars"',
    link: 'https://perf.jmeter.ai/vs/apache-jmeter-vs-grafana-k6/',
    description: 'JMeter vs k6: choose <this> & "that".',
    pubDate: '2026-09-18',
  },
];

describe('rss feed builder', () => {
  it('escapes XML entities in all text fields', () => {
    expect(escapeXml(`a & b <c> "d" 'e'`)).toBe(
      'a &amp; b &lt;c&gt; &quot;d&quot; &apos;e&apos;',
    );
  });

  it('emits RFC-822 dates and falls back for invalid input', () => {
    expect(rssDate('2026-09-18')).toBe('Fri, 18 Sep 2026 00:00:00 GMT');
    expect(() => new Date(rssDate('not-a-date'))).not.toThrow();
  });

  it('builds a valid RSS 2.0 document with atom self link', () => {
    const xml = buildRssFeed(channel, items);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain(
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    );
    expect(xml).toContain(
      '<atom:link href="https://perf.jmeter.ai/feed.xml" rel="self" type="application/rss+xml" />',
    );
    expect(xml).toContain(
      '<lastBuildDate>Fri, 18 Sep 2026 00:00:00 GMT</lastBuildDate>',
    );
    expect(xml).toContain('<language>en-us</language>');
  });

  it('sorts items newest first and escapes item content', () => {
    const xml = buildRssFeed(channel, items);
    const newItemAt = xml.indexOf(
      'New item &amp; &lt;special&gt; &quot;chars&quot;',
    );
    const oldItemAt = xml.indexOf('Old item');
    expect(newItemAt).toBeGreaterThan(-1);
    expect(oldItemAt).toBeGreaterThan(newItemAt);
    expect(xml).toContain(
      'JMeter vs k6: choose &lt;this&gt; &amp; &quot;that&quot;.',
    );
    expect(xml).toContain('<guid>https://perf.jmeter.ai/reviews/wrk/</guid>');
  });

  it('defaults guid to the item link', () => {
    const xml = buildRssFeed(channel, [items[0]]);
    expect(xml).toContain('<guid>https://perf.jmeter.ai/reviews/wrk/</guid>');
  });

  it('derives lastBuildDate from the newest item when omitted', () => {
    const xml = buildRssFeed({ ...channel, lastBuildDate: undefined }, items);
    expect(xml).toContain(
      '<lastBuildDate>Fri, 18 Sep 2026 00:00:00 GMT</lastBuildDate>',
    );
  });
});

describe('sitemap excludes feed and markdown endpoints', () => {
  it('keeps file-like URLs out of the sitemap', () => {
    expect(isSitemapPage('https://perf.jmeter.ai/feed.xml')).toBe(false);
    expect(isSitemapPage('https://perf.jmeter.ai/tools/apache-jmeter.md')).toBe(
      false,
    );
    expect(isSitemapPage('https://perf.jmeter.ai/compare/')).toBe(false);
    expect(isSitemapPage('https://perf.jmeter.ai/tools/apache-jmeter/')).toBe(
      true,
    );
    expect(isSitemapPage('https://perf.jmeter.ai/')).toBe(true);
  });

  it('keeps dotted base-path homepages in the sitemap', () => {
    expect(isSitemapPage('https://example.com/v1.0/', '/v1.0')).toBe(true);
    expect(isSitemapPage('https://example.com/v1.0/about/', '/v1.0')).toBe(
      true,
    );
    expect(isSitemapPage('https://example.com/v1.0/feed.xml', '/v1.0')).toBe(
      false,
    );
    expect(isSitemapPage('https://example.com/v1.0/compare/', '/v1.0')).toBe(
      false,
    );
    expect(
      isSitemapPage('https://example.com/v1.0/tools/apache-jmeter.md', '/v1.0'),
    ).toBe(false);
  });
});
