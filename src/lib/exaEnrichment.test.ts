import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import {
  buildExaRequestBody,
  isStale,
  mergeEnrichment,
  normalizeExaResponse,
} from './exaEnrichment';

describe('Exa enrichment helpers', () => {
  it('builds a flat Exa request body from tool identity', () => {
    const body = buildExaRequestBody(tools[0]);
    expect(body.query).toContain('Apache JMeter');
    expect(body.query).toContain('https://jmeter.apache.org/');
    expect(body.type).toBe('deep');
    expect(Object.keys(body.outputSchema.properties)).toHaveLength(8);
    expect(body.contents).toEqual({ highlights: true });
  });

  it('normalizes grounded response content and citations', () => {
    const entry = normalizeExaResponse(
      {
        output: {
          content: {
            about: '  A useful tool. ',
            features: [' HTTP ', 'HTTP', '', 'Distributed'],
            pricing: 'Free',
            authorOrCompany: 'Authors',
            aiFeatures: ['AI assistant'],
            latestReleaseVersion: ' 1.2.3 ',
            latestReleaseDate: '2025-01-01',
            latestReleaseNotes: 'Bug fixes',
          },
          grounding: [
            {
              citations: [
                { url: 'https://example.com', title: 'Official' },
                { url: 'https://example.com', title: 'Official' },
                { url: 'javascript:alert(1)', title: 'Bad' },
              ],
            },
          ],
        },
      },
      '2025-02-01T00:00:00.000Z',
    );
    expect(entry.about).toBe('A useful tool.');
    expect(entry.features).toEqual(['HTTP', 'Distributed']);
    expect(entry.latestRelease?.version).toBe('1.2.3');
    expect(entry.sources).toEqual([
      { url: 'https://example.com', title: 'Official' },
    ]);
  });

  it('handles empty or garbage response content without inventing data', () => {
    const entry = normalizeExaResponse({
      output: { content: { about: 42, features: [' ', null] } },
      results: [{ url: 'not-a-url', title: 'Nope' }],
    });
    expect(entry.about).toBeUndefined();
    expect(entry.features).toBeUndefined();
    expect(entry.latestRelease).toBeUndefined();
    expect(entry.sources).toBeUndefined();
  });

  it('merges one entry while preserving prior entries in slug order', () => {
    const existing = {
      generatedAt: 'old',
      entries: {
        zed: { fetchedAt: 'yesterday', about: 'keep' },
      },
    };
    const merged = mergeEnrichment(
      existing,
      'apache-jmeter',
      {
        fetchedAt: 'today',
        about: 'new',
      },
      'now',
    );
    expect(merged.generatedAt).toBe('now');
    expect(Object.keys(merged.entries)).toEqual(['apache-jmeter', 'zed']);
    expect(merged.entries.zed.about).toBe('keep');
  });

  it('marks missing, invalid, and old timestamps stale', () => {
    const now = new Date('2025-02-14T00:00:00.000Z');
    expect(isStale(undefined, 13, now)).toBe(true);
    expect(isStale({ fetchedAt: 'invalid' }, 13, now)).toBe(true);
    expect(isStale({ fetchedAt: '2025-02-01T00:00:00.000Z' }, 13, now)).toBe(
      true,
    );
    expect(isStale({ fetchedAt: '2025-02-05T00:00:00.000Z' }, 13, now)).toBe(
      false,
    );
  });
});
