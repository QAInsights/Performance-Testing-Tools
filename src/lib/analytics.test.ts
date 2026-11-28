import { describe, expect, it } from 'vitest';
import {
  buildClickEvent,
  classifyAiReferral,
  pageTypeFromPath,
  safeParam,
  type AnalyticsTarget,
} from './analytics';

const target = (
  dataset: Record<string, string | undefined>,
): AnalyticsTarget => ({
  dataset,
  getAttribute: () => null,
});

describe('analytics helpers', () => {
  it('keeps only short non-identifying event values', () => {
    expect(safeParam('sponsor_click')).toBe('sponsor_click');
    expect(safeParam('apache-jmeter-vs-locust')).toBe(
      'apache-jmeter-vs-locust',
    );
    expect(safeParam('/reports/?q=secret')).toBeUndefined();
    expect(safeParam('person@example.com')).toBeUndefined();
    expect(safeParam('')).toBeUndefined();
  });

  it('classifies AI referral domains without retaining raw referrers', () => {
    expect(classifyAiReferral('https://chatgpt.com/share/example')).toBe(
      'chatgpt',
    );
    expect(classifyAiReferral('https://www.perplexity.ai/search?q=x')).toBe(
      'perplexity',
    );
    expect(classifyAiReferral('https://claude.ai/chat/private')).toBe('claude');
    expect(classifyAiReferral('https://example.com/?secret=1')).toBeNull();
    expect(classifyAiReferral('not-a-url')).toBeNull();
  });

  it('classifies page types at root and configured bases', () => {
    expect(pageTypeFromPath('/')).toBe('home');
    expect(pageTypeFromPath('/vs/apache-jmeter-vs-locust/')).toBe('vs');
    expect(pageTypeFromPath('/reports/state-of-performance-tools/')).toBe(
      'report',
    );
    expect(
      pageTypeFromPath(
        '/Performance-Testing-Tools/guides/cloud/',
        '/Performance-Testing-Tools',
      ),
    ).toBe('guide');
  });

  it('builds sanitized click events', () => {
    expect(
      buildClickEvent(
        target({
          analyticsEvent: 'sponsor_click',
          analyticsCta: 'open_slot',
          analyticsSlot: '2',
          analyticsPlacement: 'homepage',
          analyticsLabel: 'grafana-k6',
        }),
        '/',
      ),
    ).toEqual({
      name: 'sponsor_click',
      params: {
        page_type: 'home',
        cta: 'open_slot',
        label: 'grafana-k6',
        slot: '2',
        placement: 'homepage',
      },
    });
    expect(
      buildClickEvent(
        target({ analyticsEvent: 'download?utm_source=secret' }),
        '/reports/state-of-performance-tools/',
      ),
    ).toBeNull();
  });
});
