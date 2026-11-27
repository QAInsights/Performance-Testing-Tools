export const sponsorInquiryUrl =
  'https://github.com/QAInsights/Performance-Testing-Tools/issues/new?title=Sponsored%20listing%20inquiry&body=Company%3A%0ATool%20URL%3A%0A';

export const FEATURED_SLOT_COUNT = 3;

export const SPONSOR_TIERS = [
  {
    name: 'Claim listing',
    label: 'Verification',
    summary:
      'Verify ownership of a tool record and keep the public catalog accurate.',
    includes: [
      'Verified ownership badge',
      'Correct official URL and vendor details',
      'Changelog ownership for future updates',
    ],
  },
  {
    name: 'Featured',
    label: `Homepage · ${FEATURED_SLOT_COUNT} slots`,
    summary:
      'A clearly labeled homepage placement that links to the existing tool entity page.',
    includes: [
      'Sponsored label on the homepage slot',
      'Sponsored badge in directory rows and cards',
      'featured boolean in tools.json and per-tool JSON',
    ],
  },
  {
    name: 'Compare partner',
    label: 'Higher intent',
    summary:
      'Presence in buyer-intent surfaces without overriding editorial comparisons.',
    includes: [
      'Eligibility for partner callouts on comparison pages',
      'Newsletter or launch mention when scheduled',
      'UTM-ready links for sponsor reporting',
    ],
  },
] as const;
