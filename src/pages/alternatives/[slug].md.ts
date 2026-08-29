import { tools } from '../../data/tools';
import {
  allAlternativesHubs,
  alternativesForHub,
} from '../../lib/comparisonContent';
import { hubPeers } from '../../lib/derivedComparisons';
import { alternativesMarkdown } from '../../lib/markdownMirror';
import { siteOrigin } from '../../config/site';

export function getStaticPaths() {
  return allAlternativesHubs(tools).flatMap((hub) => {
    const tool = tools.find((item) => item.slug === hub.toolSlug);
    if (!tool) return [];
    const peers =
      hub.tier === 'B' ? hubPeers(tool, tools) : alternativesForHub(hub, tools);
    return {
      params: { slug: hub.toolSlug },
      props: { hub, tool, peers },
    };
  });
}

export function GET({
  props,
}: {
  props: {
    hub: Parameters<typeof alternativesMarkdown>[0];
    tool: (typeof tools)[number];
    peers: Parameters<typeof alternativesMarkdown>[2];
  };
}) {
  const { hub, tool, peers } = props;
  return new Response(alternativesMarkdown(hub, tool, peers, siteOrigin), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
