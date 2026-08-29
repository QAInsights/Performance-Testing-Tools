import { tools } from '../../data/tools';
import { getEnrichment } from '../../lib/enrichmentData';
import { toolMarkdown } from '../../lib/markdownMirror';
import { siteOrigin } from '../../config/site';

export function getStaticPaths() {
  return tools.map((tool) => ({
    params: { slug: tool.slug },
    props: { tool },
  }));
}

export function GET({ props }: { props: { tool: (typeof tools)[number] } }) {
  const { tool } = props;
  const body = toolMarkdown(
    tool,
    tools,
    siteOrigin,
    getEnrichment(tool.slug, tool),
  );
  return new Response(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
