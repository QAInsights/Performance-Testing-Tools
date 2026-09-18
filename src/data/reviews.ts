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

export interface ReviewSection {
  heading: string;
  paragraphs: string[];
}

export interface ToolReview {
  slug: string;
  reviewedAt: string;
  /** Curator verdict, 60 to 90 words. Doubles as the page answer box. */
  verdict: string;
  /** One or two sentences on what the curator actually did for this review. */
  evidence: string;
  /** Long-form curator analysis, 3 to 5 headed sections. */
  analysis: ReviewSection[];
  /** Closing recommendation, starts with "Bottom line:". */
  bottomLine: string;
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
  if (review.analysis.length < 3 || review.analysis.length > 5)
    problems.push('analysis needs 3-5 sections');
  for (const section of review.analysis) {
    if (!section.heading.trim() || section.paragraphs.length === 0)
      problems.push(
        'analysis sections need a heading and at least one paragraph',
      );
  }
  if (!review.bottomLine.startsWith('Bottom line:'))
    problems.push('bottomLine must start with "Bottom line:"');
  if (!review.evidence.trim()) problems.push('evidence is required');
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
    evidence:
      'I have used JMeter since the 2.x days, run training on it for years, and for this review I installed the current 5.6 release, built a plan with HTTP and JDBC samplers, and ran it headless and in distributed mode.',
    analysis: [
      {
        heading: 'What JMeter is',
        paragraphs: [
          'Apache JMeter is the load testing tool most of us started with, and there is a reason it is still the first name that comes up in any tool discussion. It is a Java desktop application where you build a test plan as a tree: thread groups, samplers, controllers, listeners, and assertions. The plan is saved as a JMX file, which is XML, and the same file runs from the GUI, from the command line, from Maven, from Docker, and from every commercial cloud runner in the market.',
          'That portability is the real asset. When a customer asks me which tool their whole organization can standardize on, JMeter is usually the honest answer, because the tester who prefers a GUI, the developer who prefers Groovy, and the platform team that wants to run it in Kubernetes all get what they need from one plan.',
        ],
      },
      {
        heading: 'In practice',
        paragraphs: [
          'Authoring a first HTTP plan takes an afternoon. Recording via the HTTP(S) Test Script Recorder works, but I always tell my students to hand-build the important requests and use the recorder only to discover them. Correlation is where the real effort goes: extracting tokens with the JSON or Regular Expression extractors and feeding them into the next sampler. It is verbose compared with k6 or Gatling, but it is also fully visual, which is exactly what non-programmers need.',
          'For load runs, never use the GUI. Run jmeter -n with a JTL results file and generate the HTML dashboard afterwards. On a 4 core load generator I comfortably drive a few hundred threads with realistic think time; beyond that the thread-per-user model starts eating heap, and you add more injectors or move to a cloud runner. Distributed mode still works over RMI, but I find Taurus or a commercial runner less painful for anything beyond two or three machines.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'The XML plan is hostile to code review. Two engineers changing the same JMX will fight through diffs that no reviewer can read. Memory per thread is high, so JMeter needs more hardware than Go or JVM async tools for the same concurrency. The stock HTML dashboard is fine for a quick look but most teams end up shipping results to InfluxDB and Grafana through the Backend Listener, and that is one more thing to operate. And the GUI, honestly, looks the same as it did a decade ago.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'JMeter itself has no AI. That gap is what pushed me to build Feather Wand, the JMeter AI agent, and JMeter.AI: they sit next to the GUI and help generate elements, explain plans, and analyse results. Treat these as assistants for authoring and analysis; the load engine itself is unchanged and deterministic, which is what you want.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: if you need protocols beyond HTTP, a GUI for the team, and zero licensing cost, JMeter is still the safest default in 2026. Keep the GUI for authoring, run headless everywhere else, and pair it with Taurus or a Grafana backend for reporting. If your tests must be code in a pull request, look at k6 or Gatling instead.',
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
    evidence:
      'Hands-on review: I installed the current k6 release, scripted a representative HTTP and gRPC scenario with thresholds, and ran it locally and in GitHub Actions. I also maintain a k6 video series and published a k6 MCP server.',
    analysis: [
      {
        heading: 'What k6 is, and what it is not',
        paragraphs: [
          "k6 is a command line load generator written in Go that runs test scripts written in JavaScript or TypeScript. It is not Node.js. The runtime is Grafana's own ES module interpreter, which means npm packages that touch the filesystem or the network will not work, and it also means the memory cost per virtual user is a fraction of what a JVM tool spends. It ships as one static binary with no dependencies, and that is most of the reason it slots so cleanly into CI images and containers.",
          'Most developers I work with prefer k6 because it fits their existing pipeline: the test is a file in the repository, reviewed like any other code, and run from the same workflow that builds the service.',
        ],
      },
      {
        heading: 'In practice',
        paragraphs: [
          'A first script is a default function that issues an HTTP request and validates it with check(). Where k6 separates itself is one step later: thresholds. Declare that p95 latency must stay under 500 ms or that the error rate must stay under 1%, and the process exits non-zero when the threshold fails. That exit code is the whole integration story for GitHub Actions, GitLab CI, or Jenkins; no plugin required.',
          'Scenarios and executors give you precise control over arrival rate versus concurrent users, which matters when you are modelling an API rather than a browser session. On my laptop I comfortably sustained a few thousand virtual users against an HTTP target before the network, not k6, became the limit. With k6 2.0 the team also removed a lot of legacy commands and flags, so check the migration notes before upgrading an older pipeline.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'Protocol coverage is deliberately narrow. HTTP/1.1, HTTP/2, WebSocket, gRPC, and browser automation through the Chromium-backed browser module are first class. Anything beyond that, from Kafka to SQL to MQTT, means compiling a custom binary with xk6 extensions. It is a workable path, but it is a build step your team now owns, and with the 2.0 module path change every extension needed an update.',
          'Reporting out of the box is a terminal summary plus JSON or CSV. Trend charts, comparison between runs, and shareable dashboards assume you send metrics to Grafana, Prometheus, or Grafana Cloud k6, which is where the commercial model lives. The AGPL-3.0 license is also worth a conversation with legal if your organization distributes modified versions.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'There is no AI inside the open source CLI, and I think that is the right call for a tool whose value is a deterministic pass or fail. Grafana Cloud k6 adds AI-assisted test creation from recordings and natural language result summaries. Both help a team get started; experienced performance engineers will still write the thresholds by hand.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: for teams that write services in code and want performance to be a gate in the same pipeline, k6 is the most direct route available today. If you need broad enterprise protocols or a recorder-first workflow, JMeter or a commercial suite will serve you better.',
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
    evidence:
      'Hands-on review: I ran the current open source Gatling bundle with the Java DSL through Maven, recorded and replayed an HTTP simulation, and compared the generated report against JMeter and k6 output.',
    analysis: [
      {
        heading: 'What Gatling is',
        paragraphs: [
          'Gatling is a JVM load testing tool built on an asynchronous, non-blocking engine. You write a simulation in Java, Kotlin, or Scala using a typed DSL, compile it, and run it from Maven, Gradle, or sbt. There are also JavaScript and TypeScript SDKs now, which lowers the entry barrier for non-JVM developers, but the JVM path is still the mature one.',
          'The company behind it sells Gatling Enterprise, and the split between the two editions is the thing to understand before you commit: the open source edition is excellent on one machine, and everything about running on many machines and watching results live sits in the paid tier.',
        ],
      },
      {
        heading: 'In practice',
        paragraphs: [
          'If you are comfortable in Java or Kotlin, the DSL reads naturally: a scenario is a chain of exec calls with checks, feeders supply test data, and injection profiles describe how users arrive. Because the simulation compiles, a typo in a JSON path or a wrong parameter fails before the load run starts, not fifteen minutes into it. I appreciate this every time I come back from JMeter, where the same mistake shows up as a red sampler in the results tree.',
          'The HTML report generated at the end of a run is, in my opinion, the best default report in the open source field. Response time percentiles, active users over time, and per-request breakdowns are all there without standing up Grafana. Throughput per injector is also very high thanks to the async engine.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'The open source edition is single node only. When one injector is not enough, you either script your own orchestration across machines and merge simulation logs by hand, or you buy Enterprise. Protocol support covers HTTP, WebSocket, SSE, JMS, MQTT, and gRPC; there is no JDBC sampler and nothing for legacy enterprise stacks. The Scala heritage still leaks into documentation and stack traces, and the compile step slows down the edit and run loop compared with k6 or Locust. Enterprise pricing is quote based, so budgeting takes a sales call.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'Neither edition offers AI-assisted authoring or analysis today. Given how strong the typed DSL is, I do not consider that a blocker, but if AI-generated scripts are on your roadmap, this is a gap to note.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: Gatling is the right pick when a Java or Kotlin team wants typed, reviewable load tests and a polished report without extra infrastructure. Plan for Enterprise if you need distributed runs, and look elsewhere if your testers do not code.',
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
    evidence:
      'Hands-on review: I installed the current Locust release with pip, wrote a locustfile against an HTTP API and a gRPC client, and ran it headless in CI and in master and worker mode.',
    analysis: [
      {
        heading: 'What Locust is',
        paragraphs: [
          'Locust is a Python load testing framework. There is no DSL and no XML; a test is a Python class with tasks, and each virtual user runs those tasks in a lightweight gevent greenlet. Because it is just Python, anything you can import becomes load testable: a REST client, a gRPC stub, a database driver, a message queue producer.',
          'That is the pitch, and for Python teams it is a very good one. Most of the data and ML platform teams I talk to already have Python clients for their internal services, and Locust lets them reuse those clients rather than re-implementing the protocol in a load tool.',
        ],
      },
      {
        heading: 'In practice',
        paragraphs: [
          'Getting started is genuinely fast. pip install locust, write a class with an @task method, and run locust -f locustfile.py. The web UI at port 8089 lets you set users and spawn rate and watch request rate and response time charts live, which is helpful during exploratory tuning. For CI you run headless with a user count, a spawn rate, and a duration, and Locust exits non-zero when your failure ratio or response time thresholds are breached.',
          'Master and worker distribution is a couple of flags. Spin up workers on other machines or containers, point them at the master, and the UI aggregates everything. It is the simplest distribution story in the open source field.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'Efficiency is the trade-off. A single Python process tops out well below what k6 or Gatling deliver from one core, so you reach for workers earlier than you expect. FastHttpUser helps a lot but changes the client API. The HTML report is functional rather than presentation ready; for stakeholders you will usually export CSV or push to Grafana. Protocol coverage is whatever Python client you wrap, which is flexible but means you own the plumbing and the metrics for anything non-HTTP. There is no recorder and no GUI authoring.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'Locust has no built-in AI features. Because a locustfile is plain Python, general coding assistants do a reasonable job generating and explaining one, but there is nothing tool specific.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: if your team lives in Python, Locust is the pragmatic choice and you will have a first test running within the hour. If you need maximum throughput per injector or polished reports out of the box, k6 or Gatling are stronger.',
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
    evidence:
      'Desk review: based on current OpenText documentation and release notes, plus many years of running and teaching LoadRunner. I did not run the current release for this review.',
    analysis: [
      {
        heading: 'What LoadRunner Professional is',
        paragraphs: [
          'LoadRunner is the tool I built the early part of my career on, and it remains the reference for enterprise protocol testing. The suite has three parts: VuGen for recording and scripting, Controller for designing and running scenarios across load generators, and Analysis for post-run reporting. Today it is sold by OpenText and sits alongside LoadRunner Enterprise, LoadRunner Cloud, and the developer-oriented LoadRunner Developer.',
          'The question with LoadRunner is never whether it can do the job. It is whether your workload justifies the price and the process that comes with it.',
        ],
      },
      {
        heading: 'What you get',
        paragraphs: [
          'The protocol list is the widest in the market: web, TruClient for browser-level scripting, SAP GUI, Citrix, Oracle NCA, RDP, terminal emulation, .NET, Java, and more. If your business runs on a packaged application with a thick client, LoadRunner is often the only tool that can drive it realistically. Correlation studio, parameterization, and runtime settings are mature, and once you know them you move fast.',
          'The Analysis module is still the benchmark for cross-correlating response times, throughput, and server monitors on one graph. Controller scenarios scale to very large virtual user counts across load generators, and there is a long history of enterprise support behind it.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'Cost is the obvious one: quote based, per virtual user, and expensive for sustained concurrency. The tooling is Windows centric, and C is still the default scripting language for most protocols, which feels dated next to JavaScript or Python tools. DevWeb brings JavaScript and a code-first workflow, but the overall experience remains GUI first, and Jenkins or Azure DevOps plugins wrap that rather than replace it. For a modern HTTP or gRPC API, cheaper code-first tools will get you there faster.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'OpenText is rolling out its Aviator assistant across the LoadRunner family for script generation and result analysis. I rate this as Adequate rather than Strong because it is still arriving and depends on your licensing tier. Watch the release notes.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: pick LoadRunner Professional when SAP, Citrix, Oracle Forms, or mainframe traffic is part of your load model and procurement expects vendor support. For web APIs owned by developers, spend the budget elsewhere.',
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
    evidence:
      'Desk review: based on the current BlazeMeter documentation, pricing pages, and prior use of the platform to run JMeter tests at scale. I did not run a fresh test on the platform for this review.',
    analysis: [
      {
        heading: 'What BlazeMeter is',
        paragraphs: [
          'BlazeMeter, now part of Perforce, is a hosted platform that runs open source load tests for you. You bring a JMeter JMX, a Gatling simulation, a k6 or Locust script, a Selenium test, or a Taurus YAML, choose locations and virtual user counts, and BlazeMeter provisions the load generators, runs the test, and hosts the report.',
          'Over the years it has grown into a broader continuous testing platform with API mocking, test data generation, and functional testing. For a platform team consolidating tools, that breadth is welcome. For a performance engineer who just wants to run a JMX at scale, it is a lot of UI to navigate.',
        ],
      },
      {
        heading: 'What you get',
        paragraphs: [
          'The core experience is very good. Upload a script, pick regions, set concurrency and ramp, and press start. Multi-region distribution, private location agents that run inside your own network, and a REST API for automation are all there. Taurus integration means the same YAML that runs locally can run in the cloud with one flag.',
          'Reporting is where BlazeMeter earns its keep: hosted dashboards, comparison across runs, trend history, and shareable links that a product manager can open without installing anything. If you have ever emailed a JMeter HTML dashboard zip to a stakeholder, you know why this matters.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'Pricing. The free tier is small and paid plans scale with virtual user hours, so sustained high concurrency or long soak tests get expensive quickly. Your reports and history live with the vendor, which is a dependency to think about. Debugging a failed cloud run is slower than debugging locally, because the logs come back after the fact. And if a single node in your own CI is enough, the platform is overkill.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'BlazeMeter has invested in AI across the platform: test generation from specifications, failure summaries, and anomaly detection in results. It is the most complete AI story among the tools reviewed here, which is why it earns a Strong rating on this dimension.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: if you already have JMeter or k6 scripts and need multi-region scale plus shareable reports without running injectors, BlazeMeter is the fastest route. Watch the virtual user hours closely, and keep local runs for day-to-day debugging.',
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
    evidence:
      'Hands-on review: I installed Artillery from npm, wrote a YAML scenario with a JavaScript processor, and ran it locally and on AWS Lambda from my own account.',
    analysis: [
      {
        heading: 'What Artillery is',
        paragraphs: [
          'Artillery is a Node.js load testing tool where the scenario is declared in YAML and custom logic lives in JavaScript or TypeScript processors. It targets HTTP, WebSocket, Socket.IO, gRPC, and Kinesis, and its Playwright engine lets one test mix API calls with real browser sessions.',
          'The most distinctive feature is distribution: Artillery can run a test across AWS Lambda functions, Fargate tasks, or Azure Container Instances in your own cloud account, with no injector fleet to manage and no vendor hosting your traffic.',
        ],
      },
      {
        heading: 'In practice',
        paragraphs: [
          'A first test is a YAML file with a target, a phases block describing arrival rate over time, and a scenario with a flow of requests. It is readable enough that a product owner can follow it in a pull request. When you need logic, you point the config at a processor file and write plain JavaScript with access to the full npm ecosystem, something k6 cannot offer.',
          'The ensure block turns your SLOs into pass or fail conditions with a non-zero exit code, so CI integration is straightforward. Running artillery run-lambda with your AWS credentials fans the test out across Lambda workers and aggregates results back, and it worked on the first try for me.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'Per-worker efficiency trails k6 and Gatling because each worker is a Node.js process; you compensate by adding workers, which is easy but not free. Open source reporting is a JSON file and a basic report; trend history and dashboards live in Artillery Cloud. YAML gets awkward once branching logic grows, and you find yourself moving more into processors. The community is smaller than k6 or JMeter, so answers take longer to find.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'Artillery has no AI-assisted authoring or analysis today; Artillery Cloud is focused on reporting and collaboration. Because scenarios are YAML and JavaScript, general coding assistants can help, but nothing is built in.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: Artillery is the right pick when you want declarative scenarios with Node.js escape hatches and serverless distribution from your own AWS account. If raw efficiency per injector or rich open source reporting is the priority, k6 or Gatling are better fits.',
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
    evidence:
      'Desk review: based on current Tricentis NeoLoad documentation and release notes, plus earlier evaluations of NeoLoad against LoadRunner for enterprise clients. I did not run the current release for this review.',
    analysis: [
      {
        heading: 'What NeoLoad is',
        paragraphs: [
          'NeoLoad, from Tricentis, is a commercial load testing platform that positions itself between LoadRunner and the open source tools. It records web and packaged application traffic, including SAP GUI, Citrix, and Oracle Forms, and its automatic correlation engine removes much of the manual work that makes classic enterprise scripting slow.',
          'What makes it interesting in 2026 is the as-code side: a YAML project format, Docker based load generators, a CLI, and a REST API, which let an enterprise team keep the protocol coverage they need while moving toward pipeline driven testing.',
        ],
      },
      {
        heading: 'What you get',
        paragraphs: [
          'NeoLoad Desktop handles recording and design with a GUI, and the correlation framework identifies dynamic values automatically for common frameworks, which is a real time saver compared with hand correlating in VuGen or JMeter. Load generators run as Docker containers, and cloud bursting is built in when you need more.',
          'NeoLoad Web provides dashboards with SLA tracking and trend history that stakeholders can use directly, and the Jenkins, GitLab, and Azure DevOps integrations are native rather than bolted on.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'Licensing is commercial, quote based, and tiered by concurrent virtual users, so it is hard to budget without a sales conversation. The project format is vendor specific, and even with the YAML path, code-first developers may find the GUI first design a step backward from k6 or Gatling. The community is small next to JMeter or k6, so you rely on vendor support and documentation. For simple HTTP APIs, open source tools already cover the need.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'Tricentis is adding AI-assisted correlation and analysis across its suite, and NeoLoad benefits from that investment. I rate it Adequate: useful, arriving, and tied to your license tier rather than a differentiator on its own yet.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: NeoLoad suits enterprise teams that need SAP, Citrix, or packaged application coverage and want a more modern, pipeline friendly workflow than classic LoadRunner. If your targets are plain HTTP and your team writes code, an open source tool will do the job for free.',
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
    evidence:
      'Hands-on review: I installed Taurus with pip, wrapped an existing JMeter plan and a k6 script in YAML, added pass and fail criteria, and ran both locally and in a Docker based CI job.',
    analysis: [
      {
        heading: 'What Taurus is',
        paragraphs: [
          'Taurus, or bzt, is not a load generator. It is an open source wrapper from BlazeMeter that makes JMeter, Gatling, Locust, k6, Selenium, and a few others behave like one tool. You write a short YAML file that names the executor, the script or a list of URLs, the load profile, and the pass or fail criteria; Taurus downloads the executor if needed, runs it, shows a live console dashboard, and produces JUnit XML for your CI server.',
          'For JMeter users especially, this is the fastest way to become CI friendly. I have recommended it in training sessions for years for exactly that reason.',
        ],
      },
      {
        heading: 'In practice',
        paragraphs: [
          'pip install bzt, then bzt quick_test.yml. A minimal file points at a JMX, sets concurrency, ramp-up, and hold-for, and adds criteria such as avg-rt greater than 500 ms for 10 seconds fails the build. Taurus can also generate a simple JMX from scratch when you only have a list of endpoints, which is handy for smoke tests.',
          'The live console shows request rate, response times, and errors while the test runs, and with a BlazeMeter account one flag sends the report to the cloud. The Docker image means the same YAML runs anywhere without installing Java or Python yourself.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'Any abstraction leaks. When the underlying executor misbehaves you now debug two layers, and executor-specific tuning sometimes requires dropping back to the native configuration anyway. The project moves slowly; releases are infrequent and new executor versions can lag. Python is required even when your executor is JVM based, and the JMX that Taurus generates from YAML only covers simple scenarios. If you already use a code-first tool with native CI support such as k6, Taurus adds little.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'None. Taurus is a thin orchestration layer and does not attempt AI-assisted authoring or analysis.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: if you run JMeter or several load tools in CI and want one YAML interface with pass or fail criteria, Taurus is worth the afternoon it takes to set up. Skip it if you are already on a single code-first tool that speaks to your pipeline natively.',
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
    evidence:
      'Hands-on review: I built wrk from source on Linux and ran it with Lua scripts against local HTTP services and a public endpoint to compare throughput with k6 and JMeter.',
    analysis: [
      {
        heading: 'What wrk is',
        paragraphs: [
          'wrk is a single purpose HTTP benchmarking tool written in C. It uses an event loop with multiple threads to hold a fixed number of connections open against one URL for a fixed duration, and it reports requests per second and a latency distribution. That is the whole tool, and that is the point.',
          'I keep wrk around for one question: how many requests per second can this endpoint take from one box? For that question nothing in this catalog answers faster or with less overhead.',
        ],
      },
      {
        heading: 'In practice',
        paragraphs: [
          'Install it with brew or build from source, then run wrk -t4 -c100 -d30s against the URL. In seconds you have throughput, latency percentiles, and error counts. A Lua script lets you set headers, build request bodies, rotate paths, and inspect responses, which covers authenticated APIs and simple POST workloads.',
          'Because it saturates hardware that would choke a JVM tool, wrk is ideal for framework and server micro-benchmarks, for tuning a reverse proxy, or for a quick sanity check on a new build before the real load test.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'Everything that makes a load test realistic is missing by design. No ramp-up, no stages, no think time, no multi-step user journeys. HTTP/1.1 only, so no HTTP/2, WebSocket, or gRPC. The output is text on the console; you parse it yourself if you want it in a dashboard. There is no distribution mode. Upstream releases are infrequent, and if you need a constant request rate rather than open-loop hammering, use the wrk2 fork instead.',
        ],
      },
      {
        heading: 'AI features',
        paragraphs: [
          'None, and rightly so. wrk is a focused C benchmark and adding AI would be beside the point.',
        ],
      },
    ],
    bottomLine:
      'Bottom line: use wrk when you want raw HTTP throughput numbers from one machine in under a minute. For anything that resembles a user scenario, or anything you need to report on, reach for k6, Gatling, or JMeter.',
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
