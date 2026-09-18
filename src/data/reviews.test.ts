import { describe, expect, it } from 'vitest';
import { reviews, validateReview } from './reviews';
import { tools } from './tools';

describe('curated tool reviews dataset', () => {
  it('contains a complete, valid record for every review', () => {
    for (const review of reviews) {
      expect(validateReview(review), review.slug).toHaveLength(0);
    }
  });

  it('only reviews tools in the catalog', () => {
    for (const review of reviews) {
      expect(tools.some((tool) => tool.slug === review.slug)).toBe(true);
    }
  });

  it('has unique slugs', () => {
    expect(new Set(reviews.map((review) => review.slug)).size).toBe(
      reviews.length,
    );
  });

  it('keeps review copy free of em and en dashes', () => {
    for (const review of reviews) {
      const copy = [
        review.verdict,
        ...review.pickWhen,
        ...review.skipWhen,
        ...review.ratings.map((rating) => rating.note),
        ...review.pros,
        ...review.cons,
        ...(review.gettingStarted
          ? [
              review.gettingStarted.install ?? '',
              review.gettingStarted.firstRun ?? '',
              review.gettingStarted.learningCurve,
            ]
          : []),
      ];
      for (const text of copy) {
        expect(text, review.slug).not.toMatch(/[—–]/);
      }
    }
  });
});
