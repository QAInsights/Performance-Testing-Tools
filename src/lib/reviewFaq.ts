import type { Tool } from '../data/tools';
import type { ToolReview } from '../data/reviews';
import type { FaqItem } from './toolFaq';
import { clampAnswer } from './toolFaq';

const firstSentences = (value: string, count: number) => {
  const sentences = value.match(/[^.!?]+[.!?](?=\s|$)/g) || [];
  return sentences.slice(0, count).join(' ').trim() || value.trim();
};

const reviewAnswer = (text: string, suffix: string) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  let expanded =
    clean.split(/\s+/).filter(Boolean).length >= 40
      ? clean
      : `${clean} ${suffix}`;
  if (expanded.split(/\s+/).filter(Boolean).length < 40) {
    expanded +=
      ' Compare the current documentation, operating model, and total cost with the project requirements before making a final decision.';
  }
  return clampAnswer(expanded, 40, 80);
};

export function buildReviewFaq(
  tool: Tool,
  review: ToolReview,
  _catalog: readonly Tool[] = [],
): FaqItem[] {
  void _catalog;
  const items: FaqItem[] = [
    {
      question: `Is ${tool.name} worth it in 2026?`,
      answer: reviewAnswer(
        `${firstSentences(review.verdict, 2)} ${review.pickWhen[0]}`,
        `That makes it worth considering when the team's workload and authoring model match these strengths.`,
      ),
    },
    {
      question: `When should you pick ${tool.name}?`,
      answer: reviewAnswer(
        review.pickWhen.join(' '),
        `Together, these are the clearest signals that ${tool.name} fits the project.`,
      ),
    },
    {
      question: `When should you skip ${tool.name}?`,
      answer: reviewAnswer(
        review.skipWhen.join(' '),
        `Treat these constraints as reasons to compare alternatives before committing to ${tool.name}.`,
      ),
    },
  ];
  const aiRating = review.ratings.find(
    (rating) => rating.dimension === 'AI features',
  );
  if (aiRating) {
    items.push({
      question: `Does ${tool.name} have AI features?`,
      answer: reviewAnswer(
        aiRating.note,
        `Check the current product documentation before relying on these capabilities in production.`,
      ),
    });
  }
  return items;
}
