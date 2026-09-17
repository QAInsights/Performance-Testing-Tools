export type ReviewLevel = 'Strong' | 'Adequate' | 'Limited';

export type ReviewDimension =
  | 'Scripting & extensibility'
  | 'Protocol coverage'
  | 'Scale & distribution'
  | 'Reporting & analysis'
  | 'CI/CD & automation'
  | 'Cost & licensing'
  | 'AI features'
  | 'Input formats'
  | 'Learning curve';

export interface ReviewRating {
  dimension: ReviewDimension;
  level: ReviewLevel;
  note: string;
}

export interface ReviewGettingStarted {
  install?: string;
  firstRun?: string;
  learningCurve: string;
}

export interface ToolReview {
  slug: string;
  reviewedAt: string;
  /** Curator verdict, 60 to 90 words. Doubles as the page answer box. */
  verdict: string;
  pickWhen: string[];
  skipWhen: string[];
  ratings: ReviewRating[];
  pros: string[];
  cons: string[];
  gettingStarted?: ReviewGettingStarted;
  /** True when the curator ran the tool for this review rather than desk-reviewing docs. */
  handsOn: boolean;
}

export const reviewLevels: readonly ReviewLevel[] = [
  'Strong',
  'Adequate',
  'Limited',
];

const wordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

export function validateReview(review: ToolReview): string[] {
  const problems: string[] = [];
  const words = wordCount(review.verdict);
  if (words < 60 || words > 90)
    problems.push(`verdict is ${words} words; expected 60-90`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt))
    problems.push('reviewedAt must be YYYY-MM-DD');
  if (review.pickWhen.length < 2 || review.pickWhen.length > 3)
    problems.push('pickWhen needs 2-3 items');
  if (review.skipWhen.length < 2 || review.skipWhen.length > 3)
    problems.push('skipWhen needs 2-3 items');
  if (review.ratings.length < 4 || review.ratings.length > 7)
    problems.push('ratings needs 4-7 dimensions');
  const dims = new Set(review.ratings.map((r) => r.dimension));
  if (dims.size !== review.ratings.length)
    problems.push('ratings dimensions must be unique');
  for (const rating of review.ratings) {
    if (!rating.note.trim())
      problems.push(`rating "${rating.dimension}" is missing a note`);
  }
  if (review.pros.length < 3 || review.pros.length > 5)
    problems.push('pros needs 3-5 items');
  if (review.cons.length < 3 || review.cons.length > 5)
    problems.push('cons needs 3-5 items');
  return problems;
}

export const reviews: ToolReview[] = [
  {
    slug: 'apache-jmeter',
    reviewedAt: '2026-09-17',
    handsOn: true,
    verdict:
      'JMeter is still the safest default when you need broad protocol coverage and a tool everyone on the team has at least heard of. The GUI is dated and the XML test plans are hostile to code review, but the plugin ecosystem, JDBC and JMS samplers, and the sheer volume of tutorials mean you rarely hit a wall. Run it headless in CI, keep the GUI for authoring, and pair it with Taurus or a listener backend for reporting.',
    pickWhen: [
      'You need JDBC, JMS, FTP, or LDAP samplers alongside HTTP in one plan',
      'The team wants a GUI for authoring and a mature plugin catalog',
      'Your CI already runs Java and you want zero-cost licensing',
    ],
    skipWhen: [
      'Tests must live in reviewable code rather than XML',
      'You need thousands of virtual users per injector with low memory',
      'Real-browser rendering is part of the load model',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Adequate',
        note: 'Groovy via JSR223 is flexible, but logic lives inside XML test plans.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Strong',
        note: 'HTTP, JDBC, JMS, FTP, TCP, LDAP out of the box; gRPC and MQTT via plugins.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Adequate',
        note: 'Distributed mode works but is RMI-based and memory hungry per thread.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Adequate',
        note: 'HTML dashboard is serviceable; most teams ship results to InfluxDB or Grafana.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Strong',
        note: 'Headless CLI, Maven plugin, Docker images, and Taurus wrappers are all mature.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Strong',
        note: 'Apache 2.0, no usage caps, no vendor lock-in.',
      },
      {
        dimension: 'AI features',
        level: 'Adequate',
        note: 'No native AI; the JMeter AI plugin and jmeter.ai assistant add script generation and analysis.',
      },
    ],
    pros: [
      'Widest protocol coverage of any open-source load tool',
      'Huge plugin ecosystem and community knowledge base',
      'Runs anywhere Java runs; Docker images are official',
      'Every commercial cloud runner accepts a JMX file',
    ],
    cons: [
      'Thread-per-user model limits concurrency per injector',
      'XML test plans diff badly and resist code review',
      'GUI is slow and should never be used for load runs',
      'Correlation and assertions are verbose compared with code-first tools',
    ],
    gettingStarted: {
      install: 'brew install jmeter',
      firstRun: 'jmeter -n -t plan.jmx -l results.jtl -e -o report/',
      learningCurve:
        'An afternoon for a first HTTP plan; weeks to master correlation, JSR223, and distributed runs.',
    },
  },
  {
    slug: 'grafana-k6',
    reviewedAt: '2026-09-17',
    handsOn: true,
    verdict:
      'k6 is the tool to reach for when developers own performance testing. Scripts are plain JavaScript, checks and thresholds turn a run into a pass or fail, and the Go runtime handles far more virtual users per core than JMeter. Protocol breadth is the trade-off: HTTP, WebSocket, gRPC, and browser are first-class, but anything else needs an xk6 extension and a custom build. Reporting is basic without Grafana Cloud.',
    pickWhen: [
      'Tests should be JavaScript in the same repo as the service',
      'You want thresholds that fail a pipeline without extra tooling',
      'HTTP, gRPC, or WebSocket APIs are the target',
    ],
    skipWhen: [
      'You need JDBC, JMS, or SAP style protocols',
      'The team expects a recorder or GUI for authoring',
      'You want rich HTML reports without a Grafana stack',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Strong',
        note: 'ES module JavaScript, xk6 extensions in Go, and a growing jslib.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Adequate',
        note: 'HTTP, WebSocket, gRPC, and browser natively; others require xk6 builds.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Strong',
        note: 'Efficient Go VUs; the k6 Operator or Grafana Cloud handle distribution.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Adequate',
        note: 'Console summary and JSON output; dashboards need Grafana or the web dashboard flag.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Strong',
        note: 'Single binary, exit codes from thresholds, official GitHub Action.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Strong',
        note: 'AGPL-3.0 open source; cloud is optional and priced per VUH.',
      },
      {
        dimension: 'AI features',
        level: 'Adequate',
        note: 'No AI in the CLI; Grafana Cloud k6 adds AI-assisted test creation and result summaries.',
      },
    ],
    pros: [
      'Developer-friendly JavaScript with checks and thresholds built in',
      'Low memory per virtual user compared with JVM tools',
      'Single static binary, trivial to run in any CI image',
      'Browser module covers hybrid protocol plus browser scenarios',
    ],
    cons: [
      'Not Node.js: no npm packages that touch the filesystem or network',
      'Protocol gaps need a custom xk6 build',
      'Open-source reporting is thin without Grafana',
      'AGPL license needs a legal check in some organizations',
    ],
    gettingStarted: {
      install: 'brew install k6',
      firstRun: 'k6 run --vus 10 --duration 30s script.js',
      learningCurve:
        'Minutes for a first script if you know JavaScript; a day to structure scenarios and thresholds well.',
    },
  },
  {
    slug: 'gatling',
    reviewedAt: '2026-09-17',
    handsOn: true,
    verdict:
      'Gatling is the code-first option with the best built-in HTML report. Simulations in Java, Kotlin, or Scala compile, so mistakes surface before a run, and the asynchronous engine sustains high concurrency on one machine. The open-source edition stops at single-node execution and HTTP plus a few protocols; distribution, live dashboards, and team features sit behind Gatling Enterprise. Choose it when a JVM team wants typed, reviewable load tests.',
    pickWhen: [
      'Your team already writes Java, Kotlin, or Scala',
      'You want a polished HTML report with no extra services',
      'Compile-time checking of test code matters',
    ],
    skipWhen: [
      'You need distributed runs without buying Enterprise',
      'Non-JVM developers will maintain the tests',
      'Protocols beyond HTTP, WebSocket, JMS, or MQTT are required',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Strong',
        note: 'Typed DSL in Java, Kotlin, Scala, plus JavaScript and TypeScript SDKs.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Adequate',
        note: 'HTTP, WebSocket, SSE, JMS, MQTT, gRPC; no JDBC or enterprise protocols.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Adequate',
        note: 'Very efficient per node, but multi-node orchestration is Enterprise only.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Strong',
        note: 'Best default HTML report in the open-source field.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Strong',
        note: 'Maven, Gradle, and sbt plugins with assertion-based exit codes.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Adequate',
        note: 'Apache 2.0 core; distribution and dashboards require a paid tier.',
      },
      {
        dimension: 'AI features',
        level: 'Limited',
        note: 'No AI-assisted authoring or analysis in either edition today.',
      },
    ],
    pros: [
      'Typed simulations catch errors before load runs',
      'Excellent HTML report out of the box',
      'High throughput per injector from the async engine',
      'Recorder helps bootstrap HTTP scenarios',
    ],
    cons: [
      'Open-source edition is single-node only',
      'Scala heritage still shows in docs and stack traces',
      'Slower iteration loop because simulations compile',
      'Enterprise pricing is quote-based',
    ],
    gettingStarted: {
      install: 'Download the bundle or use the Maven/Gradle plugin',
      firstRun: './mvnw gatling:test',
      learningCurve:
        'A day for JVM developers; steeper for testers without programming background.',
    },
  },
  {
    slug: 'locust',
    reviewedAt: '2026-09-17',
    handsOn: true,
    verdict:
      'Locust is the pragmatic choice for Python teams. A user class is a plain Python file, so any library you already use for HTTP, gRPC, or database clients becomes a load test, and the web UI gives live charts during a run. The cost is efficiency: Python and gevent cap virtual users per process well below k6 or Gatling, so distributed workers arrive earlier than you expect. Reporting is functional rather than polished.',
    pickWhen: [
      'The team writes Python and wants tests in the same language',
      'You need to load test something with an existing Python client',
      'A live web UI during runs is useful',
    ],
    skipWhen: [
      'You need maximum requests per second per injector',
      'Detailed HTML reports must ship to stakeholders unchanged',
      'Nobody on the team is comfortable in Python',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Strong',
        note: 'Plain Python classes; any pip package can be used inside a task.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Adequate',
        note: 'HTTP built in; everything else is whatever Python client you wrap.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Adequate',
        note: 'Master and worker mode is simple, but each worker is a single Python process.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Adequate',
        note: 'Live web charts and CSV export; HTML report is basic.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Strong',
        note: 'Headless mode, exit codes on failure ratios, pip-installable.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Strong',
        note: 'MIT license with no paid tier to worry about.',
      },
      {
        dimension: 'AI features',
        level: 'Limited',
        note: 'No built-in AI features; community LLM helpers only.',
      },
    ],
    pros: [
      'Anything with a Python client can be load tested',
      'Web UI with live request rate and response time charts',
      'Simple master and worker distribution',
      'Small, readable codebase that is easy to extend',
    ],
    cons: [
      'Low throughput per process compared with Go or JVM tools',
      'FastHttpUser helps but changes the API surface',
      'Reports need extra work to be presentation ready',
      'No recorder or GUI authoring',
    ],
    gettingStarted: {
      install: 'pip install locust',
      firstRun: 'locust -f locustfile.py --headless -u 50 -r 5 -t 2m',
      learningCurve:
        'Under an hour for Python developers; the docs are short and the API is small.',
    },
  },
  {
    slug: 'loadrunner-professional',
    reviewedAt: '2026-09-17',
    handsOn: false,
    verdict:
      'LoadRunner Professional remains the reference tool for enterprise protocols. If your workload includes SAP GUI, Citrix, Oracle NCA, or terminal emulation, this is often the only tool that can drive it realistically, and the Analysis module still produces deeper correlation reports than any open-source alternative. The price, Windows-centric tooling, and C-based scripting are the trade-offs, and modern web APIs are better served by cheaper code-first tools.',
    pickWhen: [
      'You must load test SAP, Citrix, Oracle forms, or mainframe traffic',
      'Procurement expects vendor support and formal SLAs',
      'Detailed post-run analysis and correlation reports are required',
    ],
    skipWhen: [
      'The target is a modern HTTP or gRPC API',
      'Developers will own the tests and want them in git',
      'Budget is limited or licensing must be usage-based',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Adequate',
        note: 'C by default, JavaScript for web protocols; DevWeb brings a modern option.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Strong',
        note: 'Broadest protocol list in the market, including legacy enterprise stacks.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Strong',
        note: 'Controller plus load generators is proven at very large scale.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Strong',
        note: 'Analysis module remains the benchmark for cross-correlated reports.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Adequate',
        note: 'Jenkins and Azure DevOps plugins exist, but the workflow is GUI-first.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Limited',
        note: 'Quote-based commercial licensing priced per virtual user.',
      },
      {
        dimension: 'AI features',
        level: 'Adequate',
        note: 'OpenText Aviator assistant is being added for script generation and analysis.',
      },
    ],
    pros: [
      'Only realistic option for many legacy enterprise protocols',
      'Mature correlation and analysis tooling',
      'Vendor support and long release history',
      'Integrates with LoadRunner Enterprise and Cloud for scale',
    ],
    cons: [
      'Expensive per virtual user',
      'Windows-centric authoring and controller',
      'C scripting feels dated next to JavaScript or Python tools',
      'Slow to iterate compared with code-first workflows',
    ],
    gettingStarted: {
      install: 'Request a trial from OpenText and install VuGen on Windows',
      firstRun:
        'Record a business process in VuGen, then run it from Controller',
      learningCurve:
        'Weeks. Correlation, parameterization, and Controller scenarios each have their own depth.',
    },
  },
  {
    slug: 'blazemeter',
    reviewedAt: '2026-09-17',
    handsOn: false,
    verdict:
      'BlazeMeter is the easiest way to scale a JMeter, Gatling, or k6 test without operating your own injectors. Upload a script, pick regions and user counts, and get a shareable report with trend history. It also bundles API mocking, test data, and functional testing, which is a plus for platform teams and a distraction for everyone else. Costs climb quickly with concurrency, so watch the virtual user hours.',
    pickWhen: [
      'You already have JMeter or k6 scripts and need cloud scale fast',
      'Stakeholders want shareable, hosted reports with history',
      'Multi-region load generation is a requirement',
    ],
    skipWhen: [
      'Sustained high concurrency makes per-VUH pricing unaffordable',
      'Data residency rules prevent tests from running in a vendor cloud',
      'You only need single-node runs that fit in your CI',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Strong',
        note: 'Accepts JMeter, Gatling, k6, Locust, Selenium, and Taurus YAML.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Strong',
        note: 'Inherits whatever the underlying open-source engine supports.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Strong',
        note: 'Managed multi-region generators with private location agents.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Strong',
        note: 'Hosted dashboards, trend comparison, and shareable links.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Strong',
        note: 'REST API, Taurus integration, and plugins for major CI servers.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Limited',
        note: 'Free tier is small; paid plans scale with virtual user hours.',
      },
      {
        dimension: 'AI features',
        level: 'Strong',
        note: 'AI-driven test generation, failure summaries, and anomaly detection in the platform.',
      },
    ],
    pros: [
      'Runs existing open-source scripts unchanged',
      'Fast path to distributed, multi-region load',
      'Reports and trends are ready to share with non-engineers',
      'Private locations keep traffic inside your network',
    ],
    cons: [
      'Pricing escalates with concurrency and duration',
      'Platform breadth adds UI complexity',
      'Vendor dependency for reports and history',
      'Debugging failed cloud runs is slower than local runs',
    ],
    gettingStarted: {
      install: 'Sign up for the free tier at blazemeter.com',
      firstRun:
        'Upload a JMX or k6 script, choose a location, and start the test',
      learningCurve:
        'An hour to run a first upload; the platform features take longer to map.',
    },
  },
  {
    slug: 'artillery',
    reviewedAt: '2026-09-17',
    handsOn: true,
    verdict:
      'Artillery is the JavaScript load tool that leans on YAML. Scenarios are declarative, custom logic drops into Node.js hooks, and the Playwright integration lets one test mix API calls with real browser sessions. Running distributed from your own AWS Lambda or Fargate account is a distinctive strength. Per-worker efficiency trails k6, and the best reporting and history live in Artillery Cloud rather than the open-source CLI.',
    pickWhen: [
      'You want declarative YAML scenarios with Node.js escape hatches',
      'Serverless distribution from your own AWS account appeals',
      'Browser and API load need to run in the same test',
    ],
    skipWhen: [
      'Maximum efficiency per injector is the priority',
      'You want to avoid Node.js in the toolchain',
      'Rich reports are needed without a cloud subscription',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Strong',
        note: 'YAML plus JavaScript or TypeScript processors and a plugin API.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Adequate',
        note: 'HTTP, WebSocket, Socket.IO, gRPC, Kinesis, and Playwright browser engines.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Strong',
        note: 'Runs on AWS Lambda, Fargate, or Azure ACI from your own account.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Adequate',
        note: 'JSON output and a basic report; dashboards are in Artillery Cloud.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Strong',
        note: 'npm install, ensure thresholds, and exit codes make pipelines easy.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Strong',
        note: 'MPL-2.0 open source; cloud is optional.',
      },
      {
        dimension: 'AI features',
        level: 'Limited',
        note: 'No native AI features; Artillery Cloud focuses on reporting.',
      },
    ],
    pros: [
      'Declarative scenarios are easy to read and review',
      'Distributed runs without managing injector fleets',
      'Playwright engine for realistic browser load',
      'Full npm ecosystem available in processors',
    ],
    cons: [
      'Node.js worker efficiency is below Go or JVM tools',
      'Open-source reporting is minimal',
      'YAML gets awkward for complex branching logic',
      'Smaller community than k6 or JMeter',
    ],
    gettingStarted: {
      install: 'npm install -g artillery',
      firstRun: 'artillery run test.yml',
      learningCurve:
        'An hour for a first YAML scenario; processors and distributed runs take a day.',
    },
  },
  {
    slug: 'neoload',
    reviewedAt: '2026-09-17',
    handsOn: false,
    verdict:
      'NeoLoad sits between LoadRunner and the open-source tools. It records and correlates web, SAP GUI, Citrix, and packaged application traffic with less manual work than most, and its YAML as-code format plus Docker load generators fit CI better than classic enterprise suites. Licensing is commercial and quote-based, and code-first teams may find the GUI-centric design a step backward. Strongest for enterprise teams modernizing their process.',
    pickWhen: [
      'You need enterprise protocol support with a more modern workflow',
      'Automatic correlation would save significant scripting time',
      'The team wants both a GUI and an as-code path',
    ],
    skipWhen: [
      'Budget cannot cover commercial per-VU licensing',
      'Tests must be pure code with no vendor format',
      'Your targets are simple HTTP APIs already covered by open-source tools',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Adequate',
        note: 'GUI design plus YAML as-code; JavaScript for custom logic.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Strong',
        note: 'Web, SAP GUI, Citrix, Oracle Forms, and streaming protocols.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Strong',
        note: 'Dockerized load generators and cloud bursting are built in.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Strong',
        note: 'NeoLoad Web dashboards with SLA tracking and trend history.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Strong',
        note: 'CLI, REST API, and native Jenkins, GitLab, and Azure DevOps integrations.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Limited',
        note: 'Commercial, quote-based, with concurrent virtual user tiers.',
      },
      {
        dimension: 'AI features',
        level: 'Adequate',
        note: 'Tricentis is adding AI-assisted correlation and analysis across the suite.',
      },
    ],
    pros: [
      'Automatic correlation engine cuts scripting time',
      'Enterprise protocols without the LoadRunner price ceiling',
      'As-code YAML and Docker generators suit modern pipelines',
      'Good dashboards for sharing with stakeholders',
    ],
    cons: [
      'Commercial licensing with opaque pricing',
      'Vendor-specific project format',
      'Smaller community than JMeter or k6',
      'GUI-first design can slow down developers',
    ],
    gettingStarted: {
      install: 'Request a trial from Tricentis and install NeoLoad Desktop',
      firstRun: 'Record a user path, then run it from Desktop or the CLI',
      learningCurve:
        'Days. Faster than LoadRunner because correlation is largely automatic.',
    },
  },
  {
    slug: 'taurus',
    reviewedAt: '2026-09-17',
    handsOn: true,
    verdict:
      'Taurus is not a load generator; it is the wrapper that makes JMeter, Gatling, Locust, k6, and Selenium behave like one tool. A short YAML file declares load, pass or fail criteria, and reporting, and Taurus downloads the executor, runs it, and gives you a live console dashboard. It is the fastest way to make JMeter CI-friendly. The abstraction leaks when you need executor-specific features, and the project moves slowly.',
    pickWhen: [
      'You run JMeter in CI and want YAML config and pass/fail criteria',
      'Multiple load tools are in use and need one reporting path',
      'You want a quick load test from a list of URLs without a script',
    ],
    skipWhen: [
      'You already use a single code-first tool with native CI support',
      'Executor-specific tuning matters more than a common interface',
      'You need an actively evolving project with frequent releases',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Adequate',
        note: 'YAML config over existing scripts; can generate simple JMX from scratch.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Strong',
        note: 'Whatever the underlying executor supports.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Adequate',
        note: 'Delegates to the executor or to BlazeMeter for cloud scale.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Adequate',
        note: 'Live console dashboard, JUnit XML, and optional BlazeMeter reports.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Strong',
        note: 'pip install, Docker image, pass/fail criteria, and JUnit output.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Strong',
        note: 'Apache 2.0 open source.',
      },
      {
        dimension: 'AI features',
        level: 'Limited',
        note: 'No AI features; the project is a thin orchestration layer.',
      },
    ],
    pros: [
      'Turns JMeter into a CI-native tool with a few lines of YAML',
      'One interface across several load and functional tools',
      'Pass/fail criteria and JUnit output built in',
      'Auto-downloads and manages executor binaries',
    ],
    cons: [
      'Another layer to debug when an executor misbehaves',
      'Release cadence has slowed',
      'Python runtime required even for JVM executors',
      'Generated JMX from YAML covers only simple scenarios',
    ],
    gettingStarted: {
      install: 'pip install bzt',
      firstRun: 'bzt quick_test.yml',
      learningCurve:
        'An hour for a first YAML run; executor knowledge is still needed for real scripts.',
    },
  },
  {
    slug: 'wrk',
    reviewedAt: '2026-09-17',
    handsOn: true,
    verdict:
      'wrk is the tool for one question: how many requests per second can this endpoint take from one box? It is a single C binary with an event loop, so it saturates hardware that would choke JMeter, and Lua scripts cover custom headers, bodies, and simple response handling. Nothing else is there by design: no ramp profiles, no HTML reports, no distribution, and no HTTPS client tuning. Use it for micro-benchmarks, not user journeys.',
    pickWhen: [
      'You need maximum HTTP throughput from a single machine',
      'You are benchmarking a server or framework, not a user flow',
      'A quick latency histogram is all the reporting you need',
    ],
    skipWhen: [
      'Realistic user scenarios with think time and ramps are required',
      'The target needs anything beyond HTTP/1.1',
      'Results must be shared as reports or trended over time',
    ],
    ratings: [
      {
        dimension: 'Scripting & extensibility',
        level: 'Limited',
        note: 'LuaJIT hooks for requests and responses only.',
      },
      {
        dimension: 'Protocol coverage',
        level: 'Limited',
        note: 'HTTP/1.1 only; no HTTP/2, WebSocket, or gRPC.',
      },
      {
        dimension: 'Scale & distribution',
        level: 'Adequate',
        note: 'Extremely efficient per box, but no built-in multi-node mode.',
      },
      {
        dimension: 'Reporting & analysis',
        level: 'Limited',
        note: 'Console summary with latency percentiles; nothing exportable.',
      },
      {
        dimension: 'CI/CD & automation',
        level: 'Adequate',
        note: 'Trivial to script, but you parse the text output yourself.',
      },
      {
        dimension: 'Cost & licensing',
        level: 'Strong',
        note: 'Modified Apache 2.0, free.',
      },
      {
        dimension: 'AI features',
        level: 'Limited',
        note: 'None by design; a single-purpose C benchmark.',
      },
    ],
    pros: [
      'Highest requests per second per core of common tools',
      'Zero dependencies, one binary',
      'Lua scripting for headers, bodies, and auth',
      'Ideal for framework and server micro-benchmarks',
    ],
    cons: [
      'HTTP/1.1 only',
      'No ramp-up, stages, or think time',
      'Text output only; no JSON or HTML',
      'Upstream releases are infrequent; consider wrk2 for constant-rate tests',
    ],
    gettingStarted: {
      install: 'brew install wrk',
      firstRun: 'wrk -t4 -c100 -d30s https://example.com/',
      learningCurve: 'Ten minutes. The whole interface is a handful of flags.',
    },
  },
];

export const reviewBySlug = new Map(reviews.map((r) => [r.slug, r]));

export const getReview = (slug: string): ToolReview | undefined =>
  reviewBySlug.get(slug);
