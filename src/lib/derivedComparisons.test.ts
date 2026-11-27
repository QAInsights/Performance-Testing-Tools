import { describe, expect, it } from 'vitest';
import { ALTERNATIVES_HUBS, TIER_A_COMPARISONS } from '../data/comparisons';
import { tools } from '../data/tools';
import {
  derivedAlternativesHubs,
  derivedComparisons,
  hubPeers,
} from './derivedComparisons';
import { clampMetaDescription } from './pageMeta';

const derivedPairs = derivedComparisons(tools);
const derivedHubs = derivedAlternativesHubs(tools, ALTERNATIVES_HUBS);

describe('derived comparison content quality gates', () => {
  it('keeps derived pair paths unique and clear of Tier-A paths', () => {
    expect(derivedPairs.length).toBeLessThanOrEqual(64);
    const tierAPaths = new Set(
      TIER_A_COMPARISONS.map((comparison) => comparison.pairPath),
    );
    const derivedPaths = derivedPairs.map((comparison) => comparison.pairPath);

    expect(new Set(derivedPaths).size).toBe(derivedPaths.length);
    for (const path of derivedPaths) {
      expect(tierAPaths.has(path), path).toBe(false);
    }
  });

  it('resolves both tools for every derived pair', () => {
    for (const comparison of derivedPairs) {
      expect(
        tools.some((tool) => tool.slug === comparison.leftSlug),
        comparison.pairPath,
      ).toBe(true);
      expect(
        tools.some((tool) => tool.slug === comparison.rightSlug),
        comparison.pairPath,
      ).toBe(true);
    }
  });

  it('keeps derived pages substantive and distinct', () => {
    expect(derivedPairs.length).toBeLessThanOrEqual(64);
    expect(derivedHubs.length).toBeLessThanOrEqual(48);

    for (const comparison of derivedPairs) {
      expect(
        comparison.decisions.length,
        comparison.pairPath,
      ).toBeGreaterThanOrEqual(4);
      const left = tools.find((tool) => tool.slug === comparison.leftSlug)!;
      const right = tools.find((tool) => tool.slug === comparison.rightSlug)!;
      expect(
        [left.status, right.status].filter(
          (status) => status === 'Discontinued',
        ).length,
        comparison.pairPath,
      ).toBeLessThanOrEqual(1);
    }

    expect(
      new Set(derivedPairs.map((comparison) => comparison.answerBox)).size,
    ).toBe(derivedPairs.length);
    expect(
      new Set(derivedPairs.map((comparison) => comparison.verdict)).size,
    ).toBe(derivedPairs.length);
    expect(new Set(derivedHubs.map((hub) => hub.intro)).size).toBe(
      derivedHubs.length,
    );
    for (const hub of derivedHubs) {
      expect(hub.whenToSwitch.length, hub.toolSlug).toBeGreaterThanOrEqual(3);
    }
  });

  it('preserves the pre-promotion Tier-B paths that were emitted on 2026-08-12', () => {
    const requiredPaths = [
      'apache-jmeter-vs-locust',
      'apache-jmeter-vs-artillery',
      'apache-jmeter-vs-neoload',
      'gatling-vs-artillery',
      'grafana-k6-vs-loadrunner-professional',
      'apache-jmeter-vs-blazemeter',
      'gatling-vs-loadrunner-professional',
      'grafana-k6-vs-neoload',
      'apache-jmeter-vs-taurus',
      'gatling-vs-neoload',
      'grafana-k6-vs-blazemeter',
      'locust-vs-loadrunner-professional',
      'artillery-vs-loadrunner-professional',
      'gatling-vs-blazemeter',
      'locust-vs-neoload',
      'artillery-vs-neoload',
      'locust-vs-blazemeter',
      'artillery-vs-blazemeter',
      'loadrunner-professional-vs-neoload',
      'loadrunner-professional-vs-blazemeter',
      'loadrunner-professional-vs-taurus',
      'neoload-vs-blazemeter',
      'loadrunner-professional-vs-wrk',
      'neoload-vs-taurus',
      'blazemeter-vs-taurus',
      'apache-jmeter-vs-tsung',
      'apache-jmeter-vs-the-grinder',
      'grafana-k6-vs-tsung',
      'gatling-vs-tsung',
      'grafana-k6-vs-the-grinder',
      'apache-jmeter-vs-azure-load-testing',
      'gatling-vs-the-grinder',
      'locust-vs-tsung',
      'artillery-vs-tsung',
      'grafana-k6-vs-azure-load-testing',
      'locust-vs-the-grinder',
      'artillery-vs-the-grinder',
      'gatling-vs-azure-load-testing',
      'grafana-k6-vs-aws-distributed-load-testing',
      'gatling-vs-aws-distributed-load-testing',
      'grafana-k6-vs-grafana-cloud-k6',
      'locust-vs-azure-load-testing',
      'artillery-vs-azure-load-testing',
      'locust-vs-aws-distributed-load-testing',
      'taurus-vs-tsung',
      'taurus-vs-the-grinder',
      'taurus-vs-azure-load-testing',
      'taurus-vs-aws-distributed-load-testing',
    ];
    const allPaths = new Set([
      ...TIER_A_COMPARISONS.map((comparison) => comparison.pairPath),
      ...derivedPairs.map((comparison) => comparison.pairPath),
    ]);
    for (const path of requiredPaths) {
      expect(allPaths.has(path), path).toBe(true);
    }
  });

  it("never includes a hub's own tool in its peer list", () => {
    for (const hub of derivedHubs) {
      const tool = tools.find((item) => item.slug === hub.toolSlug)!;
      expect(
        hubPeers(tool, tools).some((peer) => peer.slug === tool.slug),
        hub.toolSlug,
      ).toBe(false);
    }
  });

  it('keeps every static page description within budget and unique', () => {
    const descriptions = [...TIER_A_COMPARISONS, ...derivedPairs].map(
      (comparison) => clampMetaDescription(comparison.answerBox),
    );
    descriptions.push(
      ...[...ALTERNATIVES_HUBS, ...derivedHubs].map((hub) =>
        clampMetaDescription(hub.intro),
      ),
    );

    expect(descriptions.every((description) => description.length <= 158)).toBe(
      true,
    );
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
