import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import { TOP_15_FAQ_SLUGS } from '../data/toolFaqs';
import {
  assertFaqQuality,
  buildToolFaq,
  clampAnswer,
  nearestRivals,
} from './toolFaq';
import { buildReviewFaq } from './reviewFaq';
import { getReview } from '../data/reviews';

describe('tool FAQ content', () => {
  it('clamps long answers without inventing content', () => {
    const long = Array.from({ length: 100 }, (_, i) => `word${i}`).join(' ');
    const clamped = clampAnswer(long);
    expect(clamped.split(/\s+/).length).toBeLessThanOrEqual(80);
  });

  it('builds answer-shaped FAQs for every tool', () => {
    for (const tool of tools) {
      const faq = buildToolFaq(tool, tools);
      expect(faq.length).toBeGreaterThanOrEqual(4);
      expect(assertFaqQuality(faq), tool.slug).toBe(true);
      expect(faq.some((item) => /\blisted as\b/i.test(item.answer))).toBe(
        false,
      );
    }
  });

  it('uses hand-written FAQs for the top 15 tools', () => {
    expect(TOP_15_FAQ_SLUGS).toHaveLength(15);
    for (const slug of TOP_15_FAQ_SLUGS) {
      const tool = tools.find((item) => item.slug === slug);
      expect(tool, slug).toBeDefined();
      if (!tool) continue;
      const faq = buildToolFaq(tool, tools);
      expect(faq.length, slug).toBeGreaterThanOrEqual(4);
      expect(assertFaqQuality(faq), slug).toBe(true);
      expect(faq[0].question.toLowerCase(), slug).toContain(
        tool.name.toLowerCase(),
      );
    }
  });

  it('mentions successor for discontinued tools', () => {
    const flood = tools.find((tool) => tool.slug === 'flood');
    if (!flood) return;
    const faq = buildToolFaq(flood, tools);
    const limitations = faq.find((item) =>
      item.question.toLowerCase().includes('limitation'),
    );
    expect(limitations?.answer.toLowerCase()).toMatch(/discontinued/);
  });

  it('finds active same-category rivals', () => {
    const jmeter = tools.find((tool) => tool.slug === 'apache-jmeter')!;
    const rivals = nearestRivals(jmeter, tools);
    expect(rivals.every((item) => item.category === jmeter.category)).toBe(
      true,
    );
    expect(rivals.every((item) => item.slug !== jmeter.slug)).toBe(true);
  });

  it('builds dedicated review FAQs in the target word band', () => {
    const tool = tools.find((item) => item.slug === 'grafana-k6')!;
    const faq = buildReviewFaq(tool, getReview(tool.slug)!);
    expect(faq.length).toBe(4);
    expect(faq.every((item) => item.answer.split(/\s+/).length >= 40)).toBe(
      true,
    );
    expect(faq.every((item) => item.answer.split(/\s+/).length <= 80)).toBe(
      true,
    );
  });
});
