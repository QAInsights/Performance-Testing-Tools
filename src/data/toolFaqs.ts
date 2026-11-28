import type { FaqItem } from '../lib/toolFaq';

export const TOP_15_FAQ_SLUGS = [
  'apache-jmeter',
  'grafana-k6',
  'gatling',
  'locust',
  'loadrunner-professional',
  'blazemeter',
  'artillery',
  'neoload',
  'taurus',
  'wrk',
  'grafana-cloud-k6',
  'azure-load-testing',
  'octoperf',
  'vegeta',
  'autocannon',
] as const;

export type TopFaqSlug = (typeof TOP_15_FAQ_SLUGS)[number];

export const toolFaqOverrides: Record<TopFaqSlug, FaqItem[]> = {
  'apache-jmeter': [
    {
      question: 'Who is Apache JMeter best for?',
      answer:
        'Apache JMeter is best for performance engineers who need a free, extensible tool for HTTP, JDBC, JMS, FTP, and TCP load testing. It fits teams that want protocol breadth, plugin extensibility, and CI-friendly CLI execution, and who can manage Java-based test plans, correlation, and JVM tuning.',
    },
    {
      question: 'How does Apache JMeter differ from Grafana k6?',
      answer:
        'JMeter uses a GUI/test-element model and broad protocol plugins, while k6 is code-first with JavaScript or TypeScript scripts. JMeter is often chosen for legacy protocols, JDBC/JMS coverage, or existing JMX assets; k6 is usually preferred for developer workflows, version-controlled tests, and lightweight API load generation.',
    },
    {
      question: 'Can Apache JMeter run in CI/CD pipelines?',
      answer:
        'Yes. JMeter runs headlessly from the command line, which makes it suitable for CI/CD pipelines. Teams typically store JMX plans in version control, parameterize test data, run non-GUI mode in CI, and export results to JTL, HTML reports, or observability backends for regression tracking.',
    },
    {
      question: 'What are the main limitations of Apache JMeter?',
      answer:
        'JMeter can require careful JVM sizing, test-plan design, and listener management for large loads. Its GUI is powerful but can become heavy for complex scenarios, and dynamic scripting often needs Groovy/JSR223 knowledge. For very high-throughput API-only tests, leaner code-first tools may be more efficient.',
    },
  ],
  'grafana-k6': [
    {
      question: 'Who is Grafana k6 best for?',
      answer:
        'Grafana k6 is best for developers and platform teams who want code-first performance tests written in JavaScript or TypeScript. It fits API, WebSocket, and gRPC load testing where tests live in Git, run in CI, and feed thresholds or observability dashboards, especially in Grafana-centric environments.',
    },
    {
      question: 'How does Grafana k6 differ from Apache JMeter?',
      answer:
        'k6 emphasizes scripted scenarios, fast CLI execution, and developer ergonomics, while JMeter emphasizes GUI-based test elements and broad protocol/plugin coverage. k6 is usually easier for API-focused teams using Git workflows; JMeter can be better when you need JDBC, JMS, FTP, or existing enterprise JMX assets.',
    },
    {
      question: 'Does Grafana k6 support browser testing?',
      answer:
        'Yes, k6 has a browser module for browser-based performance testing, but it has different resource and scripting characteristics than protocol-level k6 HTTP tests. Teams often use protocol tests for load and k6 browser or dedicated browser tools for frontend/user-experience checks, depending on scale and fidelity needs.',
    },
    {
      question: 'What are the main limitations of Grafana k6?',
      answer:
        'k6 is strong for API and protocol testing, but it is not a drop-in replacement for every JMeter plugin or legacy enterprise protocol. Browser tests are more resource-intensive than protocol tests, and teams should plan for script design, test data, and distributed/cloud execution when load requirements grow.',
    },
  ],
  gatling: [
    {
      question: 'Who is Gatling best for?',
      answer:
        'Gatling is best for engineering teams that want maintainable, code-based load tests in Java, Scala, or Kotlin. It fits HTTP, WebSocket, SSE, and JMS performance testing where high concurrency, detailed HTML reports, and CI integration matter, especially when developers own performance tests alongside application code.',
    },
    {
      question: 'How does Gatling differ from Locust?',
      answer:
        'Gatling runs on the JVM with an asynchronous engine and strongly structured simulations, while Locust uses Python user classes and gevent. Gatling often delivers higher efficiency per load generator for HTTP-heavy tests; Locust can be easier for Python teams that need flexible custom client logic.',
    },
    {
      question: 'Can Gatling tests run in CI/CD?',
      answer:
        'Yes. Gatling is designed for automation and can run in CI/CD through Maven, Gradle, sbt, or CLI workflows. Teams usually version simulations in Git, run them in build pipelines, enforce performance assertions, and publish Gatling HTML reports or feed metrics to external observability systems.',
    },
    {
      question: 'What are the main limitations of Gatling?',
      answer:
        'Gatling’s code-first model is powerful, but it requires comfort with JVM tooling and simulation design. Its open-source core has narrower protocol breadth than some enterprise suites, and teams needing GUI-first authoring, broad legacy protocol support, or centralized enterprise governance may prefer other platforms.',
    },
  ],
  locust: [
    {
      question: 'Who is Locust best for?',
      answer:
        'Locust is best for Python teams that want load tests written as regular Python code. It fits HTTP and WebSocket testing where custom behavior, reusable libraries, and quick iteration matter. The web UI and distributed worker model also make it practical for collaborative local or CI-driven performance runs.',
    },
    {
      question: 'How does Locust differ from Gatling?',
      answer:
        'Locust uses Python and gevent-based users, making it flexible and familiar for Python developers. Gatling uses JVM languages and an asynchronous engine that often handles higher concurrency per machine. Choose Locust for Python extensibility and simple authoring; choose Gatling for JVM ecosystems and efficient high-throughput generation.',
    },
    {
      question: 'Can Locust scale to large load tests?',
      answer:
        'Yes, Locust can scale by running distributed workers across multiple processes or machines. However, because each user executes Python code, it usually needs more worker resources than some compiled or JVM-based tools. Capacity planning and worker sizing are important for large high-concurrency scenarios.',
    },
    {
      question: 'What are the main limitations of Locust?',
      answer:
        'Locust’s Python flexibility comes with runtime overhead, so very high virtual-user counts can require many workers. Its native protocol focus is narrower than enterprise suites, and advanced reporting or governance often depends on external tooling. It is less suited for teams needing GUI-first, no-code workflows.',
    },
  ],
  'loadrunner-professional': [
    {
      question: 'Who is LoadRunner Professional best for?',
      answer:
        'LoadRunner Professional is best for enterprise teams testing complex web, API, packaged, and legacy applications. It fits organizations that need broad protocol coverage, centralized scripting/analysis workflows, and on-premises control. It is especially relevant where SAP, Citrix, Oracle, or other enterprise systems are in scope.',
    },
    {
      question: 'How does LoadRunner Professional differ from Apache JMeter?',
      answer:
        'LoadRunner Professional is a commercial enterprise suite with VuGen, Controller, Analysis, and wide protocol support. JMeter is open source and extensible, with strong HTTP/API and plugin coverage but lighter enterprise governance. LoadRunner often fits regulated or legacy-heavy environments; JMeter fits teams prioritizing cost and flexibility.',
    },
    {
      question: 'Does LoadRunner Professional support modern CI/CD workflows?',
      answer:
        'Yes. LoadRunner Professional can integrate with CI/CD systems through command-line execution, plugins, and enterprise tooling. Teams typically automate scenarios, manage test assets, and analyze results as part of release pipelines, but setup and licensing are usually heavier than lightweight open-source CLI tools.',
    },
    {
      question: 'What are the main limitations of LoadRunner Professional?',
      answer:
        'The main limitations are commercial licensing cost, infrastructure overhead, and a steeper learning curve. It can be more than small teams need for simple API load tests. Teams should evaluate protocol fit, license model, and operational effort before choosing it over cloud-native or open-source alternatives.',
    },
  ],
  blazemeter: [
    {
      question: 'Who is BlazeMeter best for?',
      answer:
        'BlazeMeter is best for teams that want cloud-managed performance testing with compatibility for open-source scripts like JMeter, Taurus, k6, or Gatling. It fits organizations that need scalable load generation, shared reporting, and CI/CD integrations without operating their own load infrastructure.',
    },
    {
      question: 'How does BlazeMeter differ from running JMeter yourself?',
      answer:
        'Self-managed JMeter gives full control but requires you to provision load generators, coordinate distributed runs, and manage reporting. BlazeMeter provides managed orchestration, cloud scale, collaboration, and test management features around JMeter-compatible workflows. The tradeoff is platform cost and less low-level infrastructure control.',
    },
    {
      question: 'Can BlazeMeter run tests in CI/CD pipelines?',
      answer:
        'Yes. BlazeMeter integrates with CI/CD tools and can trigger performance tests as part of build or release workflows. Teams commonly store scripts in version control, run them through BlazeMeter APIs or plugins, and use pass/fail thresholds and reports to gate releases or monitor performance trends.',
    },
    {
      question: 'What are the main limitations of BlazeMeter?',
      answer:
        'BlazeMeter reduces infrastructure work, but it adds commercial pricing and platform dependency. Teams with strict data residency, custom network topologies, or simple low-volume needs may not benefit from a managed platform. Script portability and cost at scale should be validated during evaluation.',
    },
  ],
  artillery: [
    {
      question: 'Who is Artillery best for?',
      answer:
        'Artillery is best for developers and QA engineers testing HTTP APIs, WebSocket, Socket.IO, or MQTT services in code-friendly workflows. It fits teams that want YAML scenarios with JavaScript/TypeScript hooks, fast CI feedback, and modern load testing without the overhead of heavyweight enterprise suites.',
    },
    {
      question: 'How does Artillery differ from Grafana k6?',
      answer:
        'Both are developer-friendly load tools, but Artillery emphasizes YAML scenarios with JS/TS hooks and strong realtime protocol support, while k6 emphasizes JavaScript/TypeScript code-first scripts and thresholds. Artillery can be convenient for quick scenario definitions; k6 is often chosen for programmable API test design and observability workflows.',
    },
    {
      question: 'Can Artillery be used in CI/CD pipelines?',
      answer:
        'Yes. Artillery is CLI-driven and works well in CI/CD pipelines. Teams can run scenarios as automated checks, fail builds on performance thresholds, and integrate reports into delivery workflows. Its configuration-first approach makes it straightforward to version and review tests alongside application code.',
    },
    {
      question: 'What are the main limitations of Artillery?',
      answer:
        'Artillery is strong for modern API and realtime workloads, but it has narrower legacy enterprise protocol coverage than suites like LoadRunner or NeoLoad. Very complex scenarios may require custom JavaScript logic, and teams should evaluate distributed execution and reporting needs for large-scale programs.',
    },
  ],
  neoload: [
    {
      question: 'Who is NeoLoad best for?',
      answer:
        'NeoLoad is best for enterprise teams that need a commercial performance testing platform with visual design, collaboration, and broad protocol coverage. It fits organizations testing web, API, mobile, and packaged applications such as SAP, where governance, reusable assets, and centralized analysis are important.',
    },
    {
      question: 'How does NeoLoad differ from LoadRunner Professional?',
      answer:
        'Both are enterprise performance suites, but NeoLoad emphasizes visual/no-code design with extensibility and Tricentis ecosystem integration, while LoadRunner Professional is known for deep protocol coverage and traditional VuGen/Controller workflows. The right choice depends on protocol needs, team skills, licensing, and existing tooling.',
    },
    {
      question: 'Does NeoLoad support CI/CD integration?',
      answer:
        'Yes. NeoLoad supports CI/CD integration through plugins, APIs, and command-line execution. Teams can automate performance tests in pipelines, manage test assets centrally, and share results across QA and performance engineering groups. This makes it suitable for continuous performance testing in enterprise delivery processes.',
    },
    {
      question: 'What are the main limitations of NeoLoad?',
      answer:
        'NeoLoad is a commercial platform, so licensing and operational overhead may be high for small teams or simple API tests. While it covers many enterprise protocols, teams should still validate specific protocol behavior, scaling model, and integration fit through a proof-of-concept before committing.',
    },
  ],
  taurus: [
    {
      question: 'Who is Taurus best for?',
      answer:
        'Taurus is best for teams that want a unified way to run performance tests across multiple engines from CI/CD. It fits DevOps workflows where JMeter, Gatling, Locust, k6, or other tools are already in use and teams want consistent YAML configuration, execution, and reporting wrappers.',
    },
    {
      question: 'How does Taurus differ from JMeter or Gatling?',
      answer:
        'Taurus is not a load-generation engine in the same way; it is an automation/orchestration layer. JMeter and Gatling execute the actual test logic and protocols, while Taurus provides a common config and runner around them. Use Taurus to standardize execution, not to replace engine-specific capabilities.',
    },
    {
      question: 'Can Taurus be used in CI/CD pipelines?',
      answer:
        'Yes. Taurus is especially useful in CI/CD because it provides a command-line interface and YAML-based configuration that can be versioned and automated. Teams use it to run existing performance scripts consistently, collect artifacts, and reduce tool-specific boilerplate in build pipelines.',
    },
    {
      question: 'What are the main limitations of Taurus?',
      answer:
        'Taurus adds an abstraction layer, so debugging complex issues may still require understanding the underlying tool. It does not eliminate engine-specific limitations or protocol gaps. Teams should treat it as an execution wrapper and validate that their required executor features are fully supported.',
    },
  ],
  wrk: [
    {
      question: 'Who is wrk best for?',
      answer:
        'wrk is best for developers and performance engineers who need quick, high-throughput HTTP benchmarks from a single machine. It fits micro-benchmarking APIs or endpoints where low overhead and fast feedback matter more than complex user journeys, GUI workflows, or enterprise reporting capabilities.',
    },
    {
      question: 'How does wrk differ from Apache JMeter?',
      answer:
        'wrk is a lightweight C-based CLI benchmark focused on raw HTTP throughput and latency. JMeter is a full load testing application with GUI/test elements, multiple protocols, assertions, and richer reporting. Use wrk for quick endpoint benchmarks; use JMeter for broader protocol coverage and complex scenarios.',
    },
    {
      question: 'Can wrk be scripted for custom scenarios?',
      answer:
        'Yes. wrk supports LuaJIT scripting for request generation, headers, and basic response handling. This makes it flexible for targeted HTTP benchmarks, but it is still not a full scenario orchestration framework. Complex multi-step business flows are usually better handled by dedicated load testing tools.',
    },
    {
      question: 'What are the main limitations of wrk?',
      answer:
        'wrk focuses on HTTP benchmarking, so it lacks native support for many enterprise protocols, distributed orchestration, and rich test reporting. It is best for single-host micro-benchmarks, not end-to-end user journey testing. Teams needing broader workflows should pair it with or replace it by fuller tools.',
    },
  ],
  'grafana-cloud-k6': [
    {
      question: 'Who is Grafana Cloud k6 best for?',
      answer:
        'Grafana Cloud k6 is best for teams already using k6 who want managed cloud execution, shared dashboards, and easier scaling. It fits organizations that want to correlate performance test results with Grafana observability data without managing their own distributed load generator infrastructure.',
    },
    {
      question: 'How does Grafana Cloud k6 differ from open-source k6?',
      answer:
        'Open-source k6 runs locally or in your own infrastructure, giving maximum control. Grafana Cloud k6 adds managed load generation, hosted results, collaboration, and Grafana-native visualization. The tradeoff is usage-based commercial pricing and cloud execution constraints that may matter for regulated environments.',
    },
    {
      question: 'Can Grafana Cloud k6 run in CI/CD pipelines?',
      answer:
        'Yes. Teams can trigger Grafana Cloud k6 tests from CI/CD pipelines using CLI and cloud integrations. This supports automated performance gates, scheduled runs, and centralized reporting. It is useful when you want repeatable k6 automation plus managed scale and shared visibility across teams.',
    },
    {
      question: 'What are the main limitations of Grafana Cloud k6?',
      answer:
        'Its main limitations are commercial usage costs, reliance on cloud execution, and the same protocol/model boundaries as k6 itself. It is not ideal for strict air-gapped environments or teams needing broad legacy protocol suites. Evaluate pricing, data residency, and execution regions before adopting.',
    },
  ],
  'azure-load-testing': [
    {
      question: 'Who is Azure Load Testing best for?',
      answer:
        'Azure Load Testing is best for teams running applications on Azure who want managed load generation integrated with Azure Monitor and CI/CD. It fits organizations using Apache JMeter or Locust scripts that need scalable test infrastructure, Azure RBAC, and easier operational setup than self-managed load farms.',
    },
    {
      question: 'How does Azure Load Testing differ from BlazeMeter?',
      answer:
        'Azure Load Testing is deeply integrated into the Azure ecosystem, with Azure-native identity, monitoring, and billing. BlazeMeter is a broader multi-cloud SaaS platform with compatibility across several open-source tools. Choose Azure Load Testing for Azure-centric workflows; choose BlazeMeter for broader tool/platform flexibility.',
    },
    {
      question: 'Can Azure Load Testing be used in CI/CD pipelines?',
      answer:
        'Yes. Azure Load Testing supports CI/CD integration through Azure DevOps, GitHub Actions, and APIs. Teams can automate test runs, pass parameters, collect metrics, and use performance criteria as quality gates. This makes it practical for continuous performance validation of Azure-hosted services.',
    },
    {
      question: 'What are the main limitations of Azure Load Testing?',
      answer:
        'Azure Load Testing is optimized for Azure workflows, so teams outside Azure may get less value. It supports JMeter and Locust, but not every protocol or custom load-testing model. Data residency, network access, and consumption pricing should be reviewed before standardizing on it.',
    },
  ],
  octoperf: [
    {
      question: 'Who is OctoPerf best for?',
      answer:
        'OctoPerf is best for teams that want JMeter-compatible performance testing with a simpler SaaS or on-prem UI. It fits organizations that value visual design, collaborative reporting, and managed load generation while keeping the ability to work with JMeter JMX assets and familiar HTTP/JDBC/JMS workflows.',
    },
    {
      question: 'How does OctoPerf differ from Apache JMeter?',
      answer:
        'OctoPerf builds on the JMeter ecosystem but adds a managed platform, visual UX, collaboration, and reporting features. Raw JMeter gives full open-source control and plugin flexibility but requires more operational effort. OctoPerf is often chosen when teams want JMeter power with less infrastructure management.',
    },
    {
      question: 'Can OctoPerf run in CI/CD pipelines?',
      answer:
        'Yes. OctoPerf supports CI/CD integrations and can run automated performance tests as part of delivery pipelines. Teams can reuse JMeter assets, execute tests from cloud or private agents, and monitor results over time. It is useful for organizations scaling JMeter practices beyond individual desktop runs.',
    },
    {
      question: 'What are the main limitations of OctoPerf?',
      answer:
        'OctoPerf is commercial, so cost and plan limits matter as usage grows. While JMeter-compatible, highly customized JMeter plugin setups or niche protocol needs should be validated carefully. Teams wanting a fully free self-hosted stack may prefer plain JMeter or other open-source tools.',
    },
  ],
  vegeta: [
    {
      question: 'Who is Vegeta best for?',
      answer:
        'Vegeta is best for developers and SREs who need repeatable HTTP load tests with constant request rates. It fits API benchmarking, latency distribution analysis, and scriptable command-line workflows. Its simple attack/report/plot model makes it useful for quick performance checks and automated regression baselines.',
    },
    {
      question: 'How does Vegeta differ from wrk?',
      answer:
        'Both are CLI HTTP benchmarking tools, but Vegeta focuses on configurable constant-rate attacks and report/plot workflows, while wrk focuses on high-throughput multithreaded benchmarking with Lua scripting. Vegeta is often preferred for controlled rate testing; wrk is often used for raw throughput micro-benchmarks.',
    },
    {
      question: 'Can Vegeta be used in CI/CD pipelines?',
      answer:
        'Yes. Vegeta’s CLI design makes it easy to run in CI/CD pipelines and shell scripts. Teams can generate deterministic load, capture JSON or text reports, and compare latency/error metrics across builds. It works best for endpoint-level performance checks rather than full browser or multi-protocol journeys.',
    },
    {
      question: 'What are the main limitations of Vegeta?',
      answer:
        'Vegeta is intentionally focused on HTTP load generation and does not provide rich GUI reporting, browser testing, or complex distributed orchestration out of the box. It is excellent for targeted API benchmarks, but teams need other tools for end-to-end scenarios, protocol breadth, or enterprise test management.',
    },
  ],
  autocannon: [
    {
      question: 'Who is Autocannon best for?',
      answer:
        'Autocannon is best for Node.js developers who need fast HTTP/1.1 benchmarking from the CLI or JavaScript API. It fits local development, CI smoke performance checks, and quick endpoint comparisons where low setup time matters. Teams can script it programmatically and inspect throughput, latency, and errors quickly.',
    },
    {
      question: 'How does Autocannon differ from wrk?',
      answer:
        'Autocannon is written in Node.js and integrates naturally with JavaScript tooling, while wrk is a C-based multithreaded benchmark tool often used for very high raw throughput. Autocannon is convenient for Node.js workflows and programmable tests; wrk is often chosen for lightweight, high-performance HTTP micro-benchmarks.',
    },
    {
      question: 'Can Autocannon be used in CI/CD pipelines?',
      answer:
        'Yes. Autocannon can run as a CLI command or Node.js script in CI/CD pipelines. Teams often use it for quick performance smoke tests, endpoint regression checks, or comparing API changes before merge. It is best for focused HTTP benchmarks, not full distributed load or user journey testing.',
    },
    {
      question: 'What are the main limitations of Autocannon?',
      answer:
        'Autocannon is focused on HTTP/1.1 benchmarking and does not cover the broad protocol, reporting, or orchestration features of full load-testing platforms. It is not ideal for complex multi-step scenarios, browser flows, or large distributed tests. Use it for fast, targeted performance feedback.',
    },
  ],
};

export function getToolFaqOverride(slug: string): FaqItem[] | undefined {
  return toolFaqOverrides[slug as TopFaqSlug];
}
