export const curator = 'QAInsights';
export const curatorUrl = 'https://qainsights.com/';
export const correctionsUrl =
  'https://github.com/QAInsights/Performance-Testing-Tools/issues/new?title=Tool%20submission%3A%20&body=Tool%20name%3A%20%0AOfficial%20URL%3A%20%0AWhat%20should%20be%20added%20or%20corrected%3F%20%0A';

export const methodologyPoints = [
  'Every record starts from the vendor’s own documentation, pricing page and source repository, then keeps the links so any claim can be re-checked.',
  'Volatile fields — pricing, latest release, feature lists — are refreshed from an evidence-gathering pass and stamped with the date they were verified; the date is printed on every tool page.',
  'Comparisons and alternatives are generated from the recorded fields, so they say what the catalog can support and nothing more.',
  'Nothing here is a benchmark. There are no ratings, no scores, and no measured throughput numbers; the load-profile sketches are deterministic drawings from a tool’s attributes, not results.',
  'Discontinued tools stay listed, with a successor when one is verified, so older references still resolve.',
  'Corrections are public: anything wrong can be fixed through a GitHub issue.',
] as const;
