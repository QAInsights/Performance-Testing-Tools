/**
 * Tier-A static head-to-head comparisons (SEO / AEO).
 * Paths are `/vs/{pairPath}`. Curator prose differentiates from thin tables.
 */
export interface ComparisonSpec {
  tier?: 'A' | 'B';
  /** URL segment, e.g. apache-jmeter-vs-grafana-k6 */
  pairPath: string;
  publishedAt?: string;
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
    publishedAt: '2026-08-12',
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
    publishedAt: '2026-08-12',
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
    publishedAt: '2026-08-12',
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
    publishedAt: '2026-08-12',
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
    publishedAt: '2026-08-12',
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
    publishedAt: '2026-08-12',
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
    publishedAt: '2026-08-12',
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
    publishedAt: '2026-08-12',
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
  {
    pairPath: 'apache-jmeter-vs-locust',
    publishedAt: '2026-11-27',
    leftSlug: 'apache-jmeter',
    rightSlug: 'locust',
    leftLabel: 'JMeter',
    rightLabel: 'Locust',
    answerBox:
      'Apache JMeter is a Java GUI and plugin ecosystem for multi-protocol load tests with JDBC, JMS, and FTP reach. Locust is a Python code-first framework where user behavior is plain code with a simple distributed model. Choose JMeter for GUI authoring and protocol breadth; choose Locust when the team writes Python and tests belong in Git.',
    verdict:
      'This pair splits on who authors the test. JMeter serves mixed teams where testers record and correlate in a GUI, then scale with plugins or cloud runners. Locust serves Python engineering teams that version scenarios like application code and distribute workers with almost no ceremony. Many shops run both: JMeter for enterprise protocol coverage, Locust for service-level developer-driven tests.',
    decisions: [
      'Pick JMeter when testers author in a GUI or protocols beyond HTTP/WebSocket matter.',
      'Pick Locust when Python is the team language and scenarios live in pull requests.',
      'Prefer JMeter for JDBC, JMS, FTP, and its large plugin catalog.',
      'Prefer Locust for pure HTTP/WebSocket services with elastic worker scaling.',
      'Consider cloud: BlazeMeter, OctoPerf, or Azure Load Testing run JMeter; Locust scales on your own workers or Azure Load Testing.',
      'Run the same endpoint mix on both and compare correlation effort before standardizing.',
    ],
  },
  {
    pairPath: 'apache-jmeter-vs-artillery',
    publishedAt: '2026-11-27',
    leftSlug: 'apache-jmeter',
    rightSlug: 'artillery',
    leftLabel: 'JMeter',
    rightLabel: 'Artillery',
    answerBox:
      'Apache JMeter is a Java GUI and plugin ecosystem for multi-protocol load tests across teams of any skill mix. Artillery is a developer-first Node toolkit with YAML scenarios, JavaScript processors, and serverless distribution. Choose JMeter for recorder workflows and plugin depth; choose Artillery for code-first Node teams testing modern APIs.',
    verdict:
      'Artillery is the lighter authoring experience for API-heavy JavaScript shops: declarative YAML, full npm access in processors, dedicated engines for WebSocket, Socket.IO, MQTT, and gRPC, plus Lambda-based distribution from your own cloud account. JMeter answers with decades of protocol coverage, a recorder non-developers can use, and a plugin market that covers JDBC, JMS, FTP, and legacy systems. The overlap is HTTP and messaging load; enterprise protocols beyond that favor JMeter.',
    decisions: [
      'Choose JMeter when GUI recording or non-HTTP protocols are non-negotiable.',
      'Choose Artillery when scenarios should read as YAML and custom logic lives in Node.js.',
      'Prefer Artillery for serverless distribution without managing injector fleets.',
      'Prefer JMeter for distributed controller grids and enterprise analysis workflows.',
      'Compare reporting: JMeter HTML dashboards vs Artillery Cloud history.',
      'Validate WebSocket and messaging needs on both before committing.',
    ],
  },
  {
    pairPath: 'apache-jmeter-vs-neoload',
    publishedAt: '2026-11-27',
    leftSlug: 'apache-jmeter',
    rightSlug: 'neoload',
    leftLabel: 'JMeter',
    rightLabel: 'NeoLoad',
    answerBox:
      'Apache JMeter is free open-source multi-protocol load testing with a GUI and a vast plugin ecosystem. NeoLoad is a commercial Tricentis platform with automatic correlation, as-code YAML projects, and enterprise governance. Choose JMeter for zero license cost and community depth; choose NeoLoad for faster enterprise authoring with vendor support.',
    verdict:
      'NeoLoad earns its price with automatic correlation, packaged-app protocol support, and Dockerized load generators that fit modern pipelines — work that costs real scripting hours in JMeter. JMeter counters with no license cost, a larger community, and cloud runners like BlazeMeter, OctoPerf, and Azure Load Testing. Enterprise buyers pick NeoLoad to modernize workflow; cost-first teams stay with JMeter.',
    decisions: [
      'Stay with JMeter when license budget is zero and plugins cover your protocols.',
      'Pick NeoLoad when correlation and SAP/Citrix coverage save more than the license costs.',
      'Compare total cost: free JMeter plus cloud runners vs NeoLoad concurrent-user tiers.',
      'Prefer NeoLoad for GUI-assisted as-code workflows across large QA teams.',
      'Hybrid setups work: open source engines for APIs, NeoLoad for packaged apps.',
      'Run a representative business journey on both before signing anything.',
    ],
  },
  {
    pairPath: 'gatling-vs-artillery',
    publishedAt: '2026-11-27',
    leftSlug: 'gatling',
    rightSlug: 'artillery',
    leftLabel: 'Gatling',
    rightLabel: 'Artillery',
    answerBox:
      'Gatling is a JVM code-first load engine with typed simulations, a high-throughput asynchronous core, and the best built-in HTML report. Artillery is a Node-first toolkit with declarative YAML scenarios and serverless distribution. Polyglot or JVM teams lean Gatling; Node-centric teams lean Artillery.',
    verdict:
      'Gatling brings engineering rigor: scenarios compile, the asynchronous engine sustains high concurrency per node, and reports are excellent out of the box, with Gatling Enterprise adding distribution and team controls. Artillery brings velocity: YAML anyone can read, processors with full npm access, and Lambda or Fargate runs from your own account. Pick on language home and reporting needs, not marketing.',
    decisions: [
      'Prefer Gatling when the team owns JVM code and wants typed, reviewable scenarios.',
      'Prefer Artillery when the stack is Node and YAML readability matters.',
      'Compare per-node efficiency: Gatling’s engine usually needs fewer injectors.',
      'Compare distribution: Gatling Enterprise vs Artillery’s own-cloud Lambda model.',
      'Check protocol specifics: Gatling on SSE/JMS, Artillery on Socket.IO/MQTT flavor.',
      'POC the hardest scenario on both, not the hello-world endpoint.',
    ],
  },
  {
    pairPath: 'grafana-k6-vs-azure-load-testing',
    publishedAt: '2026-11-27',
    leftSlug: 'grafana-k6',
    rightSlug: 'azure-load-testing',
    leftLabel: 'k6',
    rightLabel: 'Azure Load Testing',
    answerBox:
      'Grafana k6 is an open-source JavaScript load tool with thresholds, Grafana observability, and a cloud upsell. Azure Load Testing is a managed Azure service that runs JMeter or Locust plans with server-side correlation. Choose k6 for developer-owned JS tests anywhere; choose Azure Load Testing when workloads and pipelines already live in Azure.',
    verdict:
      'Azure Load Testing is the shortest path for Azure shops: upload a JMX or locustfile, pick engine instances and regions, and correlate client metrics with Azure Monitor data on one timeline. k6 is the better default for teams that want version-controlled JavaScript, thresholds as quality gates, and freedom from any single cloud. Mixing is common: k6 for service pipelines everywhere, Azure Load Testing where Azure correlation justifies the managed cost.',
    decisions: [
      'Pick k6 when tests must run in any cloud or CI without a vendor account.',
      'Pick Azure Load Testing when your app, data, and pipelines already live in Azure.',
      'Compare engines: k6 scripts vs JMeter/Locust assets you already own.',
      'Price against reality: VUH metering vs Azure consumption plus free monthly quota.',
      'Confirm identity and networking: Azure VNet injection vs k6 private load zones.',
      'Pilot both against the same staging target before committing a gate.',
    ],
  },
  {
    pairPath: 'gatling-vs-azure-load-testing',
    publishedAt: '2026-11-27',
    leftSlug: 'gatling',
    rightSlug: 'azure-load-testing',
    leftLabel: 'Gatling',
    rightLabel: 'Azure Load Testing',
    answerBox:
      'Gatling is a JVM code-first load engine for engineer-owned HTTP performance with strong reporting. Azure Load Testing is a managed Azure service that runs JMeter or Locust at scale with server-side correlation. Choose Gatling for typed simulations in Git; choose Azure Load Testing for managed Azure execution of existing JMX or Locust assets.',
    verdict:
      'Gatling suits teams that treat load tests as code and want an efficient engine with excellent local reports, plus Gatling Enterprise when distribution and governance arrive. Azure Load Testing suits Azure-centric organizations that need managed injectors and Monitor correlation without building a grid. If your team writes Gatling simulations today, neither is a drop-in replacement for the other — weigh engine fit against platform convenience.',
    decisions: [
      'Stay with Gatling when JVM simulations and local reports carry the program.',
      'Adopt Azure Load Testing when Azure hosts the app and Monitor correlation matters.',
      'Reuse matters: existing Gatling suites argue for Gatling; JMeter assets argue for Azure.',
      'Compare distribution cost: Gatling Enterprise credits vs Azure consumption pricing.',
      'Confirm protocol lists: SSE/JMS needs favor Gatling; JDBC plus Azure services favor Azure.',
      'Validate CI integration: k6-style thresholds in code vs Azure pipeline tasks.',
    ],
  },
];

/** Hub pages at /alternatives/{slug} */
export interface AlternativesHub {
  tier?: 'A' | 'B';
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
  {
    toolSlug: 'grafana-k6',
    headline: 'Grafana k6 alternatives',
    intro:
      'Teams look for k6 alternatives when they need GUI authoring, broader non-HTTP protocols, or a different cloud and reporting model. k6 remains strong for JavaScript code-first API load tests with thresholds in Git. This hub maps credible substitutes and when to stay with k6 versus switch.',
    whenToStay: [
      'Your team writes performance scenarios in JavaScript or TypeScript and reviews them in Git.',
      'You want checks, thresholds, and CI gates as first-class parts of the test.',
      'Grafana Cloud or Prometheus/Grafana observability is already your reporting home.',
    ],
    whenToSwitch: [
      'You need a GUI recorder, non-developers authoring tests, or heavy plugin/protocol coverage (JDBC, JMS, FTP).',
      'Your team prefers Python or JVM DSLs over JavaScript scenarios.',
      'You want a SaaS that orchestrates mixed engines rather than a k6-centric cloud.',
    ],
  },
  {
    toolSlug: 'gatling',
    headline: 'Gatling alternatives',
    intro:
      'Gatling alternatives come up when teams want a different language, a GUI recorder, or a cloud model outside Gatling Enterprise. Gatling remains a strong JVM code-first engine with efficient async HTTP execution and readable reports. Use this hub to compare alternatives on scripting, protocols, and operations.',
    whenToStay: [
      'Your performance engineers are comfortable with Scala, Java, or Kotlin simulations in Git.',
      'You need efficient high-concurrency HTTP load with strong built-in HTML reports.',
      'Gatling Enterprise or your own orchestration already covers distributed runs.',
    ],
    whenToSwitch: [
      'The team wants JavaScript/Python authoring instead of a JVM DSL.',
      'You need GUI recording, broad plugin protocols, or no-code authoring for mixed roles.',
      'You prefer a fully managed cloud without Gatling Enterprise licensing.',
    ],
  },
  {
    toolSlug: 'locust',
    headline: 'Locust alternatives',
    intro:
      'Locust alternatives are worth evaluating when you need a GUI, stronger enterprise reporting, or languages beyond Python. Locust stays compelling for Python teams that want user behavior as plain code and simple distributed workers. This hub compares alternatives by scripting model, deployment, and protocol reach.',
    whenToStay: [
      'Your team writes and maintains Python and wants load scenarios as normal code.',
      'HTTP/WebSocket user behavior is easy to express as Locust tasks and users.',
      'You prefer self-hosted distributed workers you can scale with simple commands.',
    ],
    whenToSwitch: [
      'You need a GUI recorder, packaged enterprise protocols, or vendor support contracts.',
      'JavaScript/TypeScript or JVM tooling is the team standard instead of Python.',
      'You want managed cloud execution without operating your own worker fleet.',
    ],
  },
  {
    toolSlug: 'artillery',
    headline: 'Artillery alternatives',
    intro:
      'Artillery alternatives matter when teams outgrow YAML-first API tests, need GUI workflows, or want different cloud economics. Artillery is strong for Node/TypeScript teams running HTTP, WebSocket, Socket.IO, and gRPC scenarios from CI. This hub helps you compare it against k6, JMeter, Gatling, Locust, and cloud platforms.',
    whenToStay: [
      'Your team is comfortable with YAML scenarios plus JavaScript/TypeScript processors.',
      'You need HTTP, WebSocket, Socket.IO, or gRPC coverage in a developer-first workflow.',
      'Serverless distribution or Artillery Cloud fits your CI and reporting model.',
    ],
    whenToSwitch: [
      'You need GUI recording, JDBC/JMS/FTP coverage, or a large plugin marketplace.',
      'Your team prefers Python or JVM code-first tools over Node.js scenarios.',
      'You want vendor-neutral cloud execution of existing JMeter or k6 assets.',
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
