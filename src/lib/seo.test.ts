import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  breadcrumbs,
  toolFaq,
  toolItemList,
  toolSoftwareApplication,
} from './seo';
import { tools } from '../data/tools';

describe('SEO structured data', () => {
  it('builds absolute URLs with exactly one project base segment', () => {
    for (const path of [
      '',
      '/',
      'tools/grafana-k6',
      '/categories/load-testing/',
    ]) {
      const url = absoluteUrl(path);
      expect(url).toMatch(
        /^https:\/\/qainsights\.github\.io\/Performance-Testing-Tools(?:\/.*)?$/,
      );
      expect(url).not.toContain(
        '/Performance-Testing-Tools/Performance-Testing-Tools',
      );
    }
  });

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
