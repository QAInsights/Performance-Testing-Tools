import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import { TIER_A_COMPARISONS, ALTERNATIVES_HUBS } from '../data/comparisons';
import {
  alternativesForHub,
  buildSpecRows,
  preferredCompareHref,
  resolveComparison,
} from './comparisonContent';
import { filterToolsForLanding } from './landingContent';
import { GUIDE_LANDINGS, PROTOCOL_LANDINGS } from '../data/landings';
import { toolAnswerBox, bestFor, notBestFor } from './toolEntity';

describe('major-win content builders', () => {
  it('resolves every Tier-A comparison against the catalog', () => {
    expect(TIER_A_COMPARISONS.length).toBeGreaterThanOrEqual(8);
    for (const spec of TIER_A_COMPARISONS) {
      const resolved = resolveComparison(spec, tools);
      expect(resolved, spec.pairPath).toBeTruthy();
      expect(resolved!.rows.length).toBeGreaterThan(5);
      expect(spec.decisions.length).toBeGreaterThanOrEqual(4);
      expect(spec.answerBox.split(/\s+/).length).toBeGreaterThan(30);
    }
  });

  it('builds alternative hubs with active peers', () => {
    for (const hub of ALTERNATIVES_HUBS) {
      const peers = alternativesForHub(hub, tools);
      expect(peers.length).toBeGreaterThan(3);
      expect(peers.every((tool) => tool.status === 'Active')).toBe(true);
    }
  });

  it('prefers static vs paths for Tier-A pairs', () => {
    expect(preferredCompareHref('apache-jmeter', 'grafana-k6')).toContain(
      'vs/',
    );
    expect(preferredCompareHref('hey', 'wrk')).toContain('compare?tools=');
  });

  it('filters landing pages to non-empty tool sets', () => {
    for (const landing of [...PROTOCOL_LANDINGS, ...GUIDE_LANDINGS]) {
      const matched = filterToolsForLanding(landing, tools);
      expect(matched.length, landing.slug).toBeGreaterThan(0);
    }
  });

  it('builds answer-shaped tool entity helpers', () => {
    const tool = tools[0];
    expect(toolAnswerBox(tool).split(/\s+/).length).toBeGreaterThan(20);
    expect(bestFor(tool).length).toBeGreaterThan(0);
    expect(notBestFor(tool).length).toBeGreaterThan(0);
    const rows = buildSpecRows(tools[0], tools[1]);
    expect(rows.some((row) => row.field === 'License')).toBe(true);
  });
});
