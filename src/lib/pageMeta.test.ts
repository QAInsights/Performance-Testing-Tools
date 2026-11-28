import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import { getReview, reviews } from '../data/reviews';
import {
  aboutDescription,
  aboutTitle,
  categoryDescription,
  categoryTitle,
  compareDescription,
  compareTitle,
  healthDescription,
  healthTitle,
  homeDescription,
  homeTitle,
  seoYear,
  reviewDescription,
  reviewTitle,
  reviewsIndexDescription,
  reviewsIndexTitle,
  timelineDescription,
  timelineTitle,
  toolDescription,
  toolTitle,
  wizardDescription,
  wizardTitle,
} from './pageMeta';

describe('page meta builders', () => {
  it('builds a home title with count and year', () => {
    expect(homeTitle()).toBe(
      `Best Performance Testing Tools (${seoYear}) - ${tools.length} Compared`,
    );
    expect(homeDescription()).toMatch(/Compare \d+ performance testing tools/);
    expect(homeDescription().length).toBeLessThanOrEqual(158);
  });

  it('builds tool titles and richer descriptions', () => {
    const jmeter = tools.find((tool) => tool.slug === 'apache-jmeter')!;
    const discontinued = tools.find((tool) => tool.status === 'Discontinued')!;
    expect(toolTitle(jmeter)).toBe(
      'Apache JMeter Review: Pricing, Pros/Cons & Alternatives (2026)',
    );
    expect(toolTitle(discontinued)).toBe(
      `${discontinued.name} Alternatives & Successor (${seoYear}) - Performance Testing`,
    );
    expect(toolDescription(jmeter)).toContain(
      'Is Apache JMeter right for your team?',
    );
    expect(toolDescription(jmeter).length).toBeLessThanOrEqual(158);
    for (const tool of tools) {
      expect(toolDescription(tool).length, tool.name).toBeLessThanOrEqual(158);
      expect(toolDescription(tool).length, tool.name).toBeGreaterThan(40);
    }
  });

  it('builds category and compare titles', () => {
    expect(categoryTitle('Load Testing')).toBe(
      `Best Load Testing Tools (${seoYear}) - Compare & Choose`,
    );
    expect(categoryDescription('Load Testing')).toMatch(/Compare \d+/);
    expect(compareTitle(['JMeter', 'k6'])).toBe(
      'JMeter vs k6: Which Is Better? (2026)',
    );
    expect(compareDescription(['JMeter', 'k6'])).toContain(
      'Compare JMeter, k6',
    );
    expect(compareTitle()).toContain('Compare Performance Testing Tools');
    expect(aboutTitle()).toContain('Curation & Methodology');
    expect(aboutDescription()).toContain('How we curate');
  });

  it('builds review titles and descriptions', () => {
    const tool = tools.find((item) => item.slug === 'grafana-k6')!;
    const review = getReview(tool.slug)!;
    expect(reviewTitle(tool)).toBe(
      'Grafana k6 review (2026): verdict, ratings, pros & cons',
    );
    expect(reviewDescription(review)).toContain('Hands-on review by');
    expect(reviewDescription(review).length).toBeLessThanOrEqual(158);
    expect(reviewsIndexTitle()).toBe(
      'Performance testing tool reviews (2026): verdicts, ratings, pros & cons',
    );
    expect(reviewsIndexDescription()).toContain(
      `${reviews
        .map((item) => item.reviewedAt)
        .sort()
        .at(-1)}`,
    );
  });

  it('builds utility page titles and descriptions', () => {
    expect(wizardTitle()).toContain('Tool Finder');
    expect(wizardDescription()).toMatch(/Answer a few questions/);
    expect(timelineTitle()).toContain('Timeline');
    expect(timelineDescription()).toMatch(/first release year/i);
    expect(healthTitle()).toContain('Repo Signals');
    expect(healthDescription()).toMatch(/GitHub stars/);
  });
});
