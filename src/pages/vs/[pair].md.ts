import { tools } from '../../data/tools';
import {
  allComparisonSpecs,
  resolveComparison,
} from '../../lib/comparisonContent';
import { comparisonMarkdown } from '../../lib/markdownMirror';
import { siteOrigin } from '../../config/site';

export function getStaticPaths() {
  return allComparisonSpecs(tools).flatMap((spec) => {
    const resolved = resolveComparison(spec, tools);
    if (!resolved) return [];
    return {
      params: { pair: spec.pairPath },
      props: { spec, ...resolved },
    };
  });
}

export function GET({
  props,
}: {
  props: {
    spec: Parameters<typeof comparisonMarkdown>[0];
    left: (typeof tools)[number];
    right: (typeof tools)[number];
    rows: Parameters<typeof comparisonMarkdown>[3];
  };
}) {
  const { spec, left, right, rows } = props;
  return new Response(comparisonMarkdown(spec, left, right, rows, siteOrigin), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
