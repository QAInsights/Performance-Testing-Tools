/**
 * Unique intros for programmatic SEO landings.
 * Only emit pages that have real catalog coverage + this copy.
 */
export interface LandingPage {
  slug: string;
  kind: 'protocol' | 'language' | 'deployment' | 'guide';
  title: string;
  description: string;
  /** 150-300 words of unique intro (plain paragraphs, join with newlines) */
  intro: string;
  /** Optional filter applied to tools */
  match: {
    protocol?: string;
    language?: string;
    deployment?: 'Cloud' | 'Self-hosted' | 'Hybrid';
    openSource?: boolean;
    discontinued?: boolean;
  };
}

export const PROTOCOL_LANDINGS: LandingPage[] = [
  {
    slug: 'grpc',
    kind: 'protocol',
    title: 'gRPC load testing tools',
    description:
      'Curated performance testing tools with gRPC support for API and service load tests.',
    intro: [
      'gRPC load testing needs tools that speak HTTP/2, protobuf contracts, and streaming patterns, not only REST URLs. Engineers usually shortlist purpose-built gRPC CLIs alongside general load platforms that added gRPC modules.',
      'In this directory, gRPC coverage appears on protocol-focused utilities and some broader engines. Use the list below to compare license, deployment, and scripting language, then open each tool page for lifecycle status and enrichment notes.',
      'When you evaluate gRPC load tools, confirm unary vs streaming support, TLS, metadata injection, and whether results export cleanly into your CI. Micro-benchmark CLIs are excellent for latency envelopes; full platforms help when gRPC is one protocol among many in a business journey.',
      'Prefer tools your team can operate: a single binary CLI for service owners, or a suite when performance engineers own multi-protocol campaigns. Always validate against a staging cluster that resembles production keepalive and load-balancer behavior.',
    ].join('\n\n'),
    match: { protocol: 'gRPC' },
  },
  {
    slug: 'websocket',
    kind: 'protocol',
    title: 'WebSocket load testing tools',
    description:
      'Tools that can generate WebSocket load for realtime and push-based applications.',
    intro: [
      'WebSocket load tests stress long-lived connections, fan-out messaging, and reconnect behavior. Classic HTTP flood tools are not enough when your product keeps sockets open for minutes or hours.',
      'This landing lists catalog tools that declare WebSocket among supported protocols. Compare whether each is a cloud SaaS, self-hosted engine, or micro-benchmark CLI, and whether scripting is code-first or GUI-led.',
      'Design scenarios that mix connection churn with message rates. Watch server file descriptors, proxy idle timeouts, and sticky sessions. Pair protocol tests with browser-level checks if clients are web apps that also open sockets from real browsers.',
      'Shortlist two tools, run the same connection budget on both, and compare error rates and p95 message latency before you standardize.',
    ].join('\n\n'),
    match: { protocol: 'WebSocket' },
  },
  {
    slug: 'http',
    kind: 'protocol',
    title: 'HTTP load testing tools',
    description:
      'Directory of HTTP and HTTPS performance testing tools across CLI, open source, and cloud.',
    intro: [
      'HTTP remains the common denominator for API and web performance testing. The market spans one-shot CLIs, open-source engines, enterprise suites, and managed cloud generators.',
      'This page filters the catalog to tools that list HTTP or HTTPS support. Use it as a map: micro-benchmark CLIs for raw throughput, code-first engines for scenario logic, and cloud platforms when you need elastic multi-region load without owning generators.',
      'Do not pick solely on peak RPS claims. Match scripting language, CI integration, protocol extras (HTTP/2, gRPC, WebSocket), and operational cost. Discontinued products stay listed so old bookmarks still resolve to successors.',
      'From here, open tool entity pages for specs and FAQs, or jump into static vs pages for Tier-A head-to-heads like JMeter vs k6.',
    ].join('\n\n'),
    match: { protocol: 'HTTP' },
  },
];

export const LANGUAGE_LANDINGS: LandingPage[] = [
  {
    slug: 'python',
    kind: 'language',
    title: 'Python load testing tools',
    description:
      'Performance testing tools that use Python for scripting or scenario definition.',
    intro: [
      'Python is popular for load testing when the same language powers services, data jobs, or QA automation. Locust is the best-known open-source option, but Python also appears in commercial platforms and orchestration layers.',
      'This landing lists tools in the catalog that include Python in their scripting languages. Some are pure Python frameworks; others accept Python among several options for hybrid teams.',
      'Evaluate developer experience, distributed worker model, and reporting. Python frameworks trade some raw concurrency for readability and ecosystem libraries. If you need extreme single-node RPS, also compare Go or specialized CLIs.',
      'Use category filters and vs pages to refine the shortlist once language fit is confirmed.',
    ].join('\n\n'),
    match: { language: 'Python' },
  },
  {
    slug: 'javascript',
    kind: 'language',
    title: 'JavaScript load testing tools',
    description:
      'Load and performance tools scripted with JavaScript or TypeScript.',
    intro: [
      'JavaScript and TypeScript dominate modern application stacks, so many teams want load tests in the same language as their services. k6 and Artillery are frequent shortlist members; enterprise suites also expose JS options.',
      'Here you will find catalog tools that list JavaScript or TypeScript for scripting. Compare open source vs commercial licensing and whether deployment is self-hosted or cloud.',
      'Code-first JS tests work well with Git, PR review, and CI. Confirm browser vs protocol testing needs: some tools focus on HTTP APIs while browser-level products drive real browsers under load.',
      'After language fit, use static comparisons and the Test Rig for hard attribute diffs.',
    ].join('\n\n'),
    match: { language: 'JavaScript' },
  },
  {
    slug: 'java',
    kind: 'language',
    title: 'Java load testing tools',
    description:
      'Performance testing tools with Java or JVM-oriented scripting and ecosystems.',
    intro: [
      'Java remains central to enterprise load testing through JMeter, Gatling, and commercial suites on the JVM. Teams with deep Java skills often prefer tools that fit existing build and ops pipelines.',
      'This page lists tools that include Java (or closely related JVM scripting such as Groovy where cataloged under Java stacks) among scripting languages. Read each entity page for exact language notes.',
      'JVM tools can be heavier to operate than tiny CLIs but excel at long scenarios, plugins, and corporate standards. Pair them with cloud runners if you want elastic generators without building a grid.',
      'Cross-check open-source engines against commercial platforms that orchestrate the same scripts at scale.',
    ].join('\n\n'),
    match: { language: 'Java' },
  },
];

export const DEPLOYMENT_LANDINGS: LandingPage[] = [
  {
    slug: 'cloud',
    kind: 'deployment',
    title: 'Cloud load testing tools',
    description:
      'Managed and cloud-deployed performance testing tools for elastic load generation.',
    intro: [
      'Cloud load testing tools provide generators, orchestration, and often reporting without you racking load injectors. They suit teams that need burst capacity, multi-region traffic, or reduced ops overhead.',
      'This landing filters the directory to cloud deployment models. Some products are pure SaaS; others are cloud control planes for open-source engines such as JMeter or k6.',
      'Watch pricing units (VUH, VUM, credits), data residency, private locations, and how results integrate with CI. Cloud convenience can hide network-path differences versus on-prem generators close to the system under test.',
      'For hybrid needs, also browse self-hosted engines and hybrid platforms that attach private regions to a hosted controller.',
    ].join('\n\n'),
    match: { deployment: 'Cloud' },
  },
  {
    slug: 'self-hosted',
    kind: 'deployment',
    title: 'Self-hosted load testing tools',
    description:
      'Self-hosted performance testing engines and CLIs you run on your own infrastructure.',
    intro: [
      'Self-hosted tools keep load generation inside your network and budget predictability under your control. They range from single-binary CLIs to full enterprise controllers you install yourself.',
      'The list below includes catalog entries marked self-hosted. Expect more operational work: capacity planning, result storage, distributed coordination, and upgrades.',
      'Self-hosted is often required for sensitive environments or when cloud egress paths would distort results. Combine with CI agents or Kubernetes jobs for automation.',
      'If elastic peaks hurt, evaluate hybrid or cloud siblings of the same engine family rather than rewriting tests from scratch.',
    ].join('\n\n'),
    match: { deployment: 'Self-hosted' },
  },
];

export const GUIDE_LANDINGS: LandingPage[] = [
  {
    slug: 'best-open-source-load-testing-tools',
    kind: 'guide',
    title: 'Best open source load testing tools',
    description:
      'Evidence-based map of open-source load and performance testing tools in the directory, with decision guidance.',
    intro: [
      'Open-source load testing tools dominate modern API and platform performance work because they are free to start, easy to put in Git, and flexible enough for CI. This guide is not a vendor ranking bought with sponsorship; it is a structured reading of the open-source entries in this directory.',
      'Start with the job to be done. Multi-protocol GUI work still points many teams to Apache JMeter. Code-first HTTP and developer workflows often shortlist Grafana k6, Gatling, Locust, or Artillery. Micro-benchmarks and quick endpoint checks favor wrk, hey, vegeta, bombardier, and similar CLIs.',
      'Look past logos. Check scripting language, protocol list, deployment model, and whether the project is still active. Discontinued tools remain in the catalog with successors so historical references stay honest.',
      'Use personal and general pick signals as curator hints, not absolute truth. Validate with a proof-of-concept against your protocols and scale. When you narrow to two options, open a static vs page or the Test Rig for side-by-side specs.',
      'Commercial clouds that run open-source engines (for example BlazeMeter, Grafana Cloud k6, OctoPerf, Azure Load Testing) can sit beside OSS cores when you need elastic generators without abandoning open scripts.',
    ].join('\n\n'),
    match: { openSource: true },
  },
  {
    slug: 'discontinued-performance-testing-tools',
    kind: 'guide',
    title: 'Discontinued performance testing tools and successors',
    description:
      'Historical and discontinued load testing products kept visible with successor guidance where known.',
    intro: [
      'Performance tooling churns: products rebrand, vendors acquire, and cloud services shut down. This directory deliberately keeps discontinued entries so old diagrams, RFPs, and blog posts still resolve to something truthful.',
      'Use this guide to scan discontinued or legacy-named tools and follow successor notes where we have them. Do not start new programs on discontinued products without confirming vendor support yourself.',
      'When a successor exists, treat it as a starting point, not a guarantee of feature parity. Re-run proof-of-concepts, especially for licensing and cloud regions.',
      'If you maintain internal runbooks, link them to the living tool entity pages here rather than static intranet copies that rot silently.',
    ].join('\n\n'),
    match: { discontinued: true },
  },
];

export function allLandings(): LandingPage[] {
  return [
    ...PROTOCOL_LANDINGS,
    ...LANGUAGE_LANDINGS,
    ...DEPLOYMENT_LANDINGS,
    ...GUIDE_LANDINGS,
  ];
}
