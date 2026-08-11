import { describe, expect, it } from 'vitest';
import { tools, validateTool } from './tools';

describe('performance tools dataset', () => {
  it('contains a complete, valid record for every tool', () => {
    expect(tools.length).toBeGreaterThanOrEqual(45);
    for (const tool of tools) {
      expect(validateTool(tool), tool.name).toBe(true);
    }
  });

  it('has unique slugs and names', () => {
    expect(new Set(tools.map((tool) => tool.slug)).size).toBe(tools.length);
    expect(new Set(tools.map((tool) => tool.name)).size).toBe(tools.length);
  });
});
