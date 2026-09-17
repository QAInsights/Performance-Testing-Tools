import { reviews } from '../../data/reviews';
import { tools } from '../../data/tools';
import { reviewMarkdown } from '../../lib/markdownMirror';
import { siteOrigin } from '../../config/site';

export function getStaticPaths() {
  return reviews.map((review) => {
    const tool = tools.find((item) => item.slug === review.slug);
    if (!tool) throw new Error(`Review has no catalog tool: ${review.slug}`);
    return {
      params: { slug: review.slug },
      props: { tool, review },
    };
  });
}

export function GET({
  props,
}: {
  props: {
    tool: (typeof tools)[number];
    review: (typeof reviews)[number];
  };
}) {
  const body = reviewMarkdown(props.tool, props.review, siteOrigin);
  return new Response(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
