import { describe, expect, it } from 'vitest';
import { loadProfilePath, loadProfilePoints } from './loadProfile';

const tool = { slug: 'grafana-k6', category: 'Load Testing' as const, deployment: 'Self-hosted' as const, protocols: ['HTTP', 'gRPC'] };

describe('load profile generator', () => {
  it('is deterministic', () => {
    expect(loadProfilePath(tool)).toBe(loadProfilePath(tool));
    expect(loadProfilePoints(tool)).toBe(loadProfilePoints(tool));
  });
  it('returns valid SVG coordinate data', () => {
    expect(loadProfilePath(tool)).toMatch(/^M \d+,\d+( L \d+,\d+)+$/);
  });
});
