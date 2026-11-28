import { tools, type Category, type Tool } from '../data/tools';
import type { ToolReview } from '../data/reviews';
import { reviews } from '../data/reviews';
import { curatorPerson } from './methodology';

/** Calendar year used in SEO titles (refresh when the strategy year rolls). */
export const seoYear = 2026;

export const siteName = 'Performance Testing Tools';

const META_DESCRIPTION_LIMIT = 158;

export function clampMetaDescription(text: string): string {
  if (text.length <= META_DESCRIPTION_LIMIT) return text;
  const cut = text.slice(0, META_DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`;
}

export function toolCount(catalog: readonly Tool[] = tools): number {
  return catalog.length;
}

export function homeTitle(catalog: readonly Tool[] = tools): string {
  return `Best Performance Testing Tools (${seoYear}) - ${toolCount(catalog)} Compared`;
}

export function homeDescription(catalog: readonly Tool[] = tools): string {
  return clampMetaDescription(
    `Compare ${toolCount(catalog)} performance testing tools by protocol, license, deployment, and lifecycle status. Find the best load testing tool for your stack.`,
  );
}

export function toolTitle(tool: Tool): string {
  if (tool.status === 'Discontinued') {
    return `${tool.name} Alternatives & Successor (${seoYear}) - Performance Testing`;
  }
  return `${tool.name} Review: Pricing, Pros/Cons & Alternatives (${seoYear})`;
}

export function toolDescription(tool: Tool): string {
  if (tool.status === 'Discontinued') {
    const successor =
      tool.successor && !/^no verified/i.test(tool.successor)
        ? ` Successor: ${tool.successor}.`
        : '';
    return clampMetaDescription(
      `${tool.name} is discontinued.${successor} Compare active alternatives, migration options, and similar performance testing tools.`,
    );
  }
  return clampMetaDescription(
    `Is ${tool.name} right for your team? See pricing model, protocols, deployment, pros/cons, and best alternatives before you choose.`,
  );
}

const firstSentence = (value: string) =>
  value.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || value.trim();

export function reviewTitle(tool: Tool): string {
  return `${tool.name} review (${seoYear}): verdict, ratings, pros & cons`;
}

export function reviewDescription(review: ToolReview): string {
  const mode = review.handsOn ? 'Hands-on' : 'Desk';
  return clampMetaDescription(
    `${firstSentence(review.verdict)} ${mode} review by ${curatorPerson.name}, updated ${review.reviewedAt}.`,
  );
}

export function reviewsIndexTitle(): string {
  return `Performance testing tool reviews (${seoYear}): verdicts, ratings, pros & cons`;
}

export function reviewsIndexDescription(
  reviewList: readonly ToolReview[] = reviews,
): string {
  const handsOn = reviewList.filter((review) => review.handsOn).length;
  const updated = reviewList
    .map((review) => review.reviewedAt)
    .sort()
    .at(-1);
  return clampMetaDescription(
    `Read ${reviewList.length} curator-authored performance testing tool reviews: ${handsOn} hands-on and ${reviewList.length - handsOn} desk reviews by ${curatorPerson.name}. Updated ${updated}.`,
  );
}

export function categoryTitle(category: Category): string {
  return `Best ${category} Tools (${seoYear}) - Compare & Choose`;
}

export function categoryDescription(
  category: Category,
  catalog: readonly Tool[] = tools,
): string {
  const count = catalog.filter((tool) => tool.category === category).length;
  return clampMetaDescription(
    `Compare ${count} ${category.toLowerCase()} tools by license, protocol, deployment, and status. Shortlist the right performance testing tool faster.`,
  );
}

export function categoryIntro(category: Category): string {
  return `A focused signal view of ${category.toLowerCase()} tools. Compare licenses, deployment models, protocols, and status before you shortlist.`;
}

export function compareTitle(toolNames: string[] = []): string {
  if (toolNames.length >= 2) {
    return `${toolNames.join(' vs ')}: Which Is Better? (${seoYear})`;
  }
  return `Compare Performance Testing Tools Side by Side (${seoYear})`;
}

export function compareDescription(toolNames: string[] = []): string {
  if (toolNames.length >= 2) {
    return clampMetaDescription(
      `Compare ${toolNames.join(', ')} on pricing, protocols, scripting, deployment, and status. See key differences before you pick a load testing tool.`,
    );
  }
  return clampMetaDescription(
    'Compare up to three performance testing tools side by side. Check licenses, protocols, deployment, and status before choosing.',
  );
}

export function wizardTitle(): string {
  return `Load Testing Tool Finder (${seoYear}) - Match Tools to Your Stack`;
}

export function wizardDescription(): string {
  return clampMetaDescription(
    'Answer a few questions to find performance testing tools that match your workload, budget, deployment, language, and maintenance needs.',
  );
}

export function timelineTitle(): string {
  return `Performance Testing Tool Timeline (${seoYear}) - First Releases`;
}

export function timelineDescription(): string {
  return clampMetaDescription(
    'Explore performance testing tools by first release year, from early load-testing platforms to modern cloud and code-first tools.',
  );
}

export function healthTitle(): string {
  return `Open-Source Performance Tool Health (${seoYear}) - Repo Signals`;
}

export function healthDescription(): string {
  return clampMetaDescription(
    'Track GitHub stars, recent activity, and archived status for open-source performance testing tools before you adopt one.',
  );
}

export function aboutTitle(): string {
  return `About Performance Testing Tools - Curation & Methodology`;
}

export function aboutDescription(catalog: readonly Tool[] = tools): string {
  return clampMetaDescription(
    `How we curate ${toolCount(catalog)} performance testing tools: lifecycle status, editorial picks, verification dates, and enrichment quality rules.`,
  );
}
