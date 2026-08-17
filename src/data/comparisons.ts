/**
 * Tier-A static head-to-head comparisons (SEO / AEO).
 * Paths are `/vs/{pairPath}`. Curator prose differentiates from thin tables.
 */
export interface ComparisonSpec {
  /** URL segment, e.g. apache-jmeter-vs-grafana-k6 */
  pairPath: string;
  leftSlug: string;
  rightSlug: string;
  /** Short display names for titles */
  leftLabel: string;
  rightLabel: string;
  /** 40-70 word plain answer for AEO */
  answerBox: string;
  /** Curator verdict paragraph */
  verdict: string;
  /** 4-6 decision bullets */
  decisions: string[];
}

export const TIER_A_COMPARISONS: ComparisonSpec[] = [
  {
    pairPath: 'apache-jmeter-vs-grafana-k6',
    leftSlug: 'apache-jmeter',
    rightSlug: 'grafana-k6',
    leftLabel: 'JMeter',
    rightLabel: 'k6',
    answerBox:
      'Apache JMeter is a Java GUI and plugin ecosystem for multi-protocol load tests. Grafana k6 is a code-first JavaScript tool with strong developer workflows and cloud options. Choose JMeter for broad protocols and recorder/GUI teams; choose k6 for CI-native JS scripts and modern observability.',
    verdict:
      'JMeter remains the default when you need protocol breadth, GUI authoring, or a large plugin market. k6 wins when teams want version-controlled JS/TS scenarios, clean thresholds, and a straight path into Grafana Cloud. Many organizations run both: JMeter for legacy and enterprise protocols, k6 for API and platform services.',
    decisions: [
      'Pick JMeter if non-developers must record and edit plans in a GUI.',
      'Pick k6 if your team already lives in JavaScript/TypeScript and Git.',
      'Prefer JMeter when you need JDBC, JMS, FTP, or heavy plugin coverage.',
      'Prefer k6 for API-first services with clear SLOs and CI gates.',
      'Consider cloud: BlazeMeter/OctoPerf/Azure for JMeter; Grafana Cloud k6 for k6.',
      'Use the Test Rig to compare license, deployment, and protocol rows side by side.',
    ],
  },
  {
    pairPath: 'apache-jmeter-vs-gatling',
    leftSlug: 'apache-jmeter',
    rightSlug: 'gatling',
    leftLabel: 'JMeter',
    rightLabel: 'Gatling',
    answerBox:
      'JMeter offers GUI and multi-protocol flexibility on the JVM. Gatling is a code-driven, high-throughput engine with expressive scenarios (Scala/Java/JS depending on edition). Choose JMeter for recorder workflows and plugins; Gatling for engineer-owned, high-concurrency HTTP suites.',
    verdict:
      'Gatling shines when performance engineers write maintainable, code-reviewed load tests and need asynchronous high concurrency. JMeter still covers more protocol ground and has a larger generalist community. Gatling Enterprise adds ops features if you outgrow the open-source engine.',
    decisions: [
      'Choose Gatling for code-first HTTP performance with strong reporting DNA.',
      'Choose JMeter when GUI, plugins, or non-HTTP protocols matter more.',
      'Evaluate team language comfort: Java/Groovy vs Scala/Java/JS Gatling styles.',
      'Budget for Gatling Enterprise if you need distributed ops without building it.',
      'Both are self-hosted open cores with commercial cloud siblings available.',
    ],
  },
  {
    pairPath: 'grafana-k6-vs-gatling',
    leftSlug: 'grafana-k6',
    rightSlug: 'gatling',
    leftLabel: 'k6',
    rightLabel: 'Gatling',
    answerBox:
      'k6 and Gatling are both code-first load tools. k6 centers on JavaScript with Grafana ecosystem hooks; Gatling centers on a high-performance engine with scenario DSLs and enterprise options. Pick k6 for JS teams and Grafana; Gatling for JVM-oriented performance groups seeking engine efficiency.',
    verdict:
      'This is often a language and ecosystem choice more than a capability cliff. k6 integrates naturally with modern frontend/backend JS shops and Grafana Cloud. Gatling remains popular in enterprises that standardize on JVM performance engineering and Gatling Enterprise packaging.',
    decisions: [
      'Prefer k6 if JavaScript/TypeScript is the team default.',
      'Prefer Gatling if you already invest in JVM performance tooling.',
      'Compare cloud paths: Grafana Cloud k6 vs Gatling Enterprise.',
      'Check protocol needs; both are strong on HTTP-family workloads.',
      'Run a two-week POC on the same API with thresholds both sides can enforce.',
    ],
  },
  {
    pairPath: 'locust-vs-grafana-k6',
    leftSlug: 'locust',
    rightSlug: 'grafana-k6',
    leftLabel: 'Locust',
    rightLabel: 'k6',
    answerBox:
      'Locust is a Python, code-defined load framework with a simple distributed model. k6 is a JavaScript-focused tool with polished CLI metrics and cloud options. Python shops often prefer Locust; polyglot or JS teams often prefer k6.',
    verdict:
      'Locust is approachable for Python engineers who want user-behavior scripts and easy horizontal workers. k6 offers a more opinionated developer UX, checks/thresholds, and a commercial cloud line under Grafana. Neither replaces multi-protocol enterprise suites by itself.',
    decisions: [
      'Choose Locust when Python is the team language and you want flexible user tasks.',
      'Choose k6 for JS scenarios, thresholds, and Grafana-aligned reporting.',
      'Both are open source and self-hostable; k6 has a clearer SaaS upsell path.',
      'For pure micro-benchmarks, also evaluate wrk, hey, or vegeta.',
    ],
  },
  {
    pairPath: 'apache-jmeter-vs-loadrunner-professional',
    leftSlug: 'apache-jmeter',
    rightSlug: 'loadrunner-professional',
    leftLabel: 'JMeter',
    rightLabel: 'LoadRunner Professional',
    answerBox:
      'JMeter is free open-source multi-protocol testing. LoadRunner Professional is a commercial enterprise suite with deep protocol support, analysis, and vendor governance. Teams choose JMeter for cost and flexibility; LoadRunner for enterprise packaging, support, and complex legacy protocols.',
    verdict:
      'LoadRunner still anchors many regulated enterprises that need vendor support, protocol packs, and established analysis workflows. JMeter competes on license cost, community plugins, and cloud runners (BlazeMeter, OctoPerf, Azure Load Testing). Migration is possible but rarely free of correlation and protocol work.',
    decisions: [
      'Keep LoadRunner when support contracts and legacy protocols are non-negotiable.',
      'Adopt JMeter when budget and OSS flexibility outweigh suite polish.',
      'Hybrid stacks are common: LoadRunner for core ERP, JMeter for APIs.',
      'Price quotes carefully; commercial suites rarely match OSS total cost.',
    ],
  },
  {
    pairPath: 'blazemeter-vs-grafana-cloud-k6',
    leftSlug: 'blazemeter',
    rightSlug: 'grafana-cloud-k6',
    leftLabel: 'BlazeMeter',
    rightLabel: 'Grafana Cloud k6',
    answerBox:
      'BlazeMeter is a multi-engine cloud platform (strong JMeter roots) with continuous testing features. Grafana Cloud k6 is hosted k6 with Grafana observability. Choose BlazeMeter for multi-tool orchestration; Grafana Cloud k6 when k6 scripts and Grafana dashboards are the center of gravity.',
    verdict:
      'BlazeMeter fits organizations standardizing on JMeter or mixed open-source engines in a SaaS control plane. Grafana Cloud k6 fits teams already standardized on k6 and Grafana. Overlap exists on HTTP load in the cloud; the ecosystem you want to live in usually decides the winner.',
    decisions: [
      'Pick BlazeMeter if JMeter assets dominate and you want cloud generators.',
      'Pick Grafana Cloud k6 if scripts are already k6 and Grafana is your ops home.',
      'Compare free tiers, data residency, and CI integration against your constraints.',
      'Neither removes the need for solid test design and environment realism.',
    ],
  },
  {
    pairPath: 'octoperf-vs-blazemeter',
    leftSlug: 'octoperf',
    rightSlug: 'blazemeter',
    leftLabel: 'OctoPerf',
    rightLabel: 'BlazeMeter',
    answerBox:
      'OctoPerf and BlazeMeter both provide cloud (and hybrid) orchestration around JMeter-class workloads. OctoPerf emphasizes SaaS and on-prem options built around JMeter. BlazeMeter offers a broader continuous testing platform under Perforce. Shortlist on pricing model, JMeter fidelity, and enterprise features.',
    verdict:
      'Both are commercial alternatives to self-hosting JMeter at scale. OctoPerf is often evaluated for focused JMeter cloud/on-prem ergonomics; BlazeMeter for platform breadth and ecosystem. Run the same JMX on both before committing.',
    decisions: [
      'Validate how each imports and runs your real JMeter plans.',
      'Compare hybrid/on-prem needs and private locations.',
      'Price free tiers vs paid capacity for your peak VU and duration.',
      'Check CI/CD and reporting export requirements early.',
    ],
  },
  {
    pairPath: 'artillery-vs-grafana-k6',
    leftSlug: 'artillery',
    rightSlug: 'grafana-k6',
    leftLabel: 'Artillery',
    rightLabel: 'k6',
    answerBox:
      'Artillery is a developer-first Node ecosystem load toolkit for HTTP, WebSocket, and more. k6 is a purpose-built load tool with JS scripting and strong cloud options. Both suit API-heavy teams; choose based on Node familiarity, protocol needs, and cloud preference.',
    verdict:
      'Artillery appeals to Node-centric teams that want flexible scenarios and Artillery Cloud when ready. k6 has broader mindshare in performance engineering and a clear Grafana path. Feature parity depends on your protocols and reporting expectations.',
    decisions: [
      'Prefer Artillery if your stack and plugins already revolve around Node.',
      'Prefer k6 for mainstream performance-engineering patterns and Grafana Cloud.',
      'Confirm WebSocket/messaging needs against each tool’s current support.',
      'POC both with the same SLA thresholds before standardizing.',
    ],
  },
];

/** Hub pages at /alternatives/{slug} */
export interface AlternativesHub {
  toolSlug: string;
  headline: string;
  intro: string;
  /** Extra decision context beyond generic “same category” */
  whenToStay: string[];
  whenToSwitch: string[];
}

export const ALTERNATIVES_HUBS: AlternativesHub[] = [
  {
    toolSlug: 'apache-jmeter',
    headline: 'Apache JMeter alternatives',
    intro:
      'Engineers search for JMeter alternatives when they want code-first workflows, managed cloud generators, or a smaller operational footprint. This hub maps credible substitutes while keeping JMeter itself as a first-class option. Use it to shortlist, then open static vs pages and the Test Rig for hard specs.',
    whenToStay: [
      'You need multi-protocol coverage beyond HTTP (JDBC, JMS, FTP, and plugins).',
      'Non-developers author tests with the GUI and recorder.',
      'You already run JMeter at scale with known cloud runners.',
    ],
    whenToSwitch: [
      'Your team wants JavaScript/Python code-first tests in Git.',
      'You prefer a SaaS control plane without managing generators yourself.',
      'You only need HTTP APIs and want lighter modern CLIs or k6/Gatling.',
    ],
  },
  {
    toolSlug: 'loadrunner-professional',
    headline: 'LoadRunner Professional alternatives',
    intro:
      'LoadRunner alternatives usually come up for license cost, cloud elasticity, or modern API stacks. Enterprise protocol depth and vendor support still favor LoadRunner in many regulated shops. This hub lists practical alternatives and how they differ on license, deployment, and scripting.',
    whenToStay: [
      'You depend on legacy or packaged-app protocols with vendor support.',
      'Governance requires a commercial suite and established analysis tooling.',
      'Existing LoadRunner scripts and skills are a large sunk cost.',
    ],
    whenToSwitch: [
      'HTTP/API workloads dominate and OSS or freemium tools are enough.',
      'You want cloud pay-as-you-go capacity without suite licensing.',
      'Teams prefer code-first tools (k6, Gatling, Locust) over VU scripting C/JS packs.',
    ],
  },
];

export function comparisonByPath(path: string): ComparisonSpec | undefined {
  return TIER_A_COMPARISONS.find((item) => item.pairPath === path);
}

export function comparisonForTools(
  a: string,
  b: string,
): ComparisonSpec | undefined {
  const set = new Set([a, b]);
  return TIER_A_COMPARISONS.find(
    (item) => set.has(item.leftSlug) && set.has(item.rightSlug),
  );
}

export function staticVsPath(
  leftSlug: string,
  rightSlug: string,
): string | null {
  const found = comparisonForTools(leftSlug, rightSlug);
  return found ? `vs/${found.pairPath}` : null;
}
