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
    expect(derivedPairs.length).toBeLessThanOrEqual(48);
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
