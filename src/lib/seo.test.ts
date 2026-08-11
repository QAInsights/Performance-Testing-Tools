import { describe, expect, it } from 'vitest';
import {
  breadcrumbs,
  toolFaq,
  toolItemList,
  toolSoftwareApplication,
} from './seo';
import { tools } from '../data/tools';

describe('SEO structured data', () => {
  it('serializes valid JSON-LD for directory and tool records', () => {
    for (const value of [
      toolItemList(tools),
      toolSoftwareApplication(tools[0]),
      toolFaq(tools[0]),
      breadcrumbs([{ name: 'Directory', path: '' }]),
    ]) {
      expect(() => JSON.parse(JSON.stringify(value))).not.toThrow();
    }
  });
});
