export const datasetLastVerified = '2026-08-11';

export type Category =
  | 'Load Testing'
  | 'Protocol/API Load'
  | 'Micro-benchmark CLI'
  | 'Cloud Load Testing'
  | 'Enterprise Suite'
  | 'Browser/RUM';
export type License = 'Open Source' | 'Commercial' | 'Freemium';
export type Deployment = 'Cloud' | 'Self-hosted' | 'Hybrid';
export type Status = 'Active' | 'Discontinued' | 'Unknown';

export interface Tool {
  slug: string;
  name: string;
  vendor: string;
  url: string;
  repoUrl?: string;
  description: string;
  longDescription: string;
  category: Category;
  license: License;
  pricingModel: string;
  deployment: Deployment;
  scriptingLanguages: string[];
  protocols: string[];
  osSupport: string[];
  firstReleased?: number;
  status: Status;
  successor?: string;
  personalPick: boolean;
  generalPick: boolean;
  cloudBased: boolean;
  openSource: boolean;
  commercial: boolean;
  tags: string[];
}

type ToolInput = Omit<
  Tool,
  'personalPick' | 'generalPick' | 'cloudBased' | 'openSource' | 'commercial'
> &
  Partial<
    Pick<
      Tool,
      | 'personalPick'
      | 'generalPick'
      | 'cloudBased'
      | 'openSource'
      | 'commercial'
    >
  >;

const makeTool = (tool: ToolInput): Tool => ({
  personalPick: false,
  generalPick: false,
  cloudBased: tool.deployment !== 'Self-hosted',
  openSource: tool.license === 'Open Source',
  commercial: tool.license === 'Commercial',
  ...tool,
});

export const tools: Tool[] = [
  makeTool({
    slug: 'apache-jmeter',
    name: 'Apache JMeter',
    vendor: 'Apache Software Foundation',
    url: 'https://jmeter.apache.org/',
    repoUrl: 'https://github.com/apache/jmeter',
    description:
      'Open-source Java application for load testing and measuring performance of web and other services.',
    longDescription:
      'Apache JMeter is a Java-based load and performance testing application. It supports HTTP, JDBC, JMS, FTP, TCP, and other protocols through test elements and plugins.',
    category: 'Load Testing',
    license: 'Open Source',
    pricingModel: 'Free; Apache License 2.0.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Java', 'Groovy'],
    protocols: ['HTTP', 'HTTPS', 'JDBC', 'JMS', 'FTP', 'TCP'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 1998,
    status: 'Active',
    generalPick: true,
    personalPick: true,
    tags: ['java', 'gui', 'plugins'],
  }),
  makeTool({
    slug: 'blazemeter',
    name: 'BlazeMeter',
    vendor: 'Perforce',
    url: 'https://www.blazemeter.com/',
    description:
      'Cloud platform for performance testing, test data, continuous testing, and observability workflows.',
    longDescription:
      'BlazeMeter provides browser-based orchestration for open-source and commercial testing tools. It can run distributed tests and integrate results into CI/CD and reporting workflows.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel:
      'Free tier and paid plans; contact vendor for enterprise pricing.',
    deployment: 'Cloud',
    scriptingLanguages: ['Java', 'JavaScript', 'Python'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'JDBC'],
    osSupport: ['Browser'],
    firstReleased: 2011,
    status: 'Active',
    cloudBased: true,
    tags: ['saas', 'ci-cd', 'jmeter'],
  }),
  makeTool({
    slug: 'loadrunner-professional',
    name: 'LoadRunner Professional',
    vendor: 'OpenText',
    url: 'https://www.opentext.com/products/loadrunner-professional',
    description:
      'Enterprise performance testing software for web, API, packaged, and legacy applications.',
    longDescription:
      'LoadRunner Professional provides protocol-based virtual users, correlation, analysis, and controller-based execution. It is the on-premises successor to Micro Focus LoadRunner.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Commercial license; request a quote.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['C', 'JavaScript', 'C#'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'SAP', 'Citrix', 'Oracle'],
    osSupport: ['Windows', 'Linux'],
    firstReleased: 1993,
    status: 'Active',
    generalPick: true,
    tags: ['enterprise', 'protocol', 'analysis'],
  }),
  makeTool({
    slug: 'loadrunner-enterprise',
    name: 'LoadRunner Enterprise',
    vendor: 'OpenText',
    url: 'https://www.opentext.com/products/loadrunner-enterprise',
    description:
      'Web-based enterprise platform for planning, executing, and analyzing performance tests.',
    longDescription:
      'LoadRunner Enterprise centralizes performance test assets and execution for teams. It supports distributed load generation and integrates with enterprise quality workflows.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Commercial license; request a quote.',
    deployment: 'Hybrid',
    scriptingLanguages: ['C', 'JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'SAP'],
    osSupport: ['Windows', 'Linux'],
    firstReleased: 2018,
    status: 'Active',
    tags: ['enterprise', 'distributed', 'web-ui'],
  }),
  makeTool({
    slug: 'loadrunner-cloud',
    name: 'LoadRunner Cloud',
    vendor: 'OpenText',
    url: 'https://www.opentext.com/products/loadrunner-cloud',
    description:
      'SaaS performance testing service with cloud load generators and enterprise test management.',
    longDescription:
      'LoadRunner Cloud runs performance tests from managed cloud infrastructure. It supports browser and protocol testing with integrated results and collaboration features.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel: 'Commercial subscription; request a quote.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript', 'C'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket'],
    osSupport: ['Browser'],
    firstReleased: 2019,
    status: 'Active',
    cloudBased: true,
    tags: ['saas', 'enterprise', 'distributed'],
  }),
  makeTool({
    slug: 'locust',
    name: 'Locust',
    vendor: 'Locust authors',
    url: 'https://locust.io/',
    repoUrl: 'https://github.com/locustio/locust',
    description:
      'Open-source, Python-based framework for writing scalable user behavior load tests.',
    longDescription:
      'Locust lets engineers describe user behavior in ordinary Python code. Tests can run distributed across processes or machines and expose an HTTP web interface.',
    category: 'Load Testing',
    license: 'Open Source',
    pricingModel: 'Free; MIT License.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Python'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2011,
    status: 'Active',
    generalPick: true,
    tags: ['python', 'distributed', 'web-ui'],
  }),
  makeTool({
    slug: 'gatling',
    name: 'Gatling',
    vendor: 'Gatling Corp.',
    url: 'https://gatling.io/',
    repoUrl: 'https://github.com/gatling/gatling',
    description:
      'Code-driven load testing tool with expressive scenarios and high-throughput asynchronous engines.',
    longDescription:
      'Gatling uses code-based simulations to model traffic and produce HTML reports. The core project supports HTTP, WebSocket, SSE, and JMS workloads.',
    category: 'Load Testing',
    license: 'Open Source',
    pricingModel: 'Free open-source core; commercial platform available.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Java', 'Scala', 'Kotlin'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'SSE', 'JMS'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2012,
    status: 'Active',
    generalPick: true,
    tags: ['jvm', 'code-first', 'ci-cd'],
  }),
  makeTool({
    slug: 'gatling-enterprise',
    name: 'Gatling Enterprise',
    vendor: 'Gatling Corp.',
    url: 'https://gatling.io/gatling-enterprise/',
    description:
      'Managed Gatling platform for distributed testing, observability, and team workflows.',
    longDescription:
      'Gatling Enterprise is the commercial cloud and self-managed platform from Gatling. It adds managed injection, scheduling, dashboards, and collaboration to Gatling tests.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel: 'Free trial and commercial plans; contact vendor.',
    deployment: 'Hybrid',
    scriptingLanguages: ['Java', 'Scala', 'Kotlin'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'JMS'],
    osSupport: ['Browser'],
    firstReleased: 2023,
    status: 'Active',
    cloudBased: true,
    tags: ['gatling', 'saas', 'distributed'],
  }),
  makeTool({
    slug: 'neoload',
    name: 'NeoLoad',
    vendor: 'Neotys / Tricentis',
    url: 'https://www.tricentis.com/software-quality-assurance-tools-neoload',
    description:
      'Enterprise performance testing platform for web, API, mobile, and packaged applications.',
    longDescription:
      'NeoLoad provides visual test design, protocol support, load generation, and analysis. Tricentis offers it as part of its software quality platform.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Commercial subscription or license; request a quote.',
    deployment: 'Hybrid',
    scriptingLanguages: ['JavaScript', 'Groovy'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'JDBC', 'SAP'],
    osSupport: ['Windows', 'Linux'],
    firstReleased: 2005,
    status: 'Active',
    tags: ['enterprise', 'visual', 'mobile'],
  }),
  makeTool({
    slug: 'loadfocus',
    name: 'LoadFocus',
    vendor: 'LoadFocus',
    url: 'https://loadfocus.com/',
    description:
      'Cloud service for load, performance, and synthetic monitoring tests.',
    longDescription:
      'LoadFocus provides browser-based test creation and cloud execution. It supports web and API performance testing with dashboards and scheduled monitoring.',
    category: 'Cloud Load Testing',
    license: 'Freemium',
    pricingModel: 'Free plan with paid usage-based plans.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket'],
    osSupport: ['Browser'],
    firstReleased: 2014,
    status: 'Active',
    cloudBased: true,
    tags: ['saas', 'monitoring', 'api'],
  }),
  makeTool({
    slug: 'flood',
    name: 'Flood',
    vendor: 'Flood IO',
    url: 'https://www.flood.io/',
    description:
      'Cloud load testing platform historically used to run JMeter and Gatling tests.',
    longDescription:
      'Flood was a hosted platform for distributed performance testing with open-source engines. The original Flood service is no longer presented as an independently active product; verify migration options before use.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel:
      'Historical commercial service; current availability requires vendor confirmation.',
    deployment: 'Cloud',
    scriptingLanguages: ['Java', 'Scala'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Browser'],
    status: 'Discontinued',
    successor: 'Tricentis NeoLoad',
    cloudBased: true,
    tags: ['legacy', 'jmeter', 'gatling'],
  }),
  makeTool({
    slug: 'loaderio',
    name: 'Loader.io',
    vendor: 'Loader.io',
    url: 'https://loader.io/',
    description:
      'Hosted HTTP load testing service for APIs and web applications.',
    longDescription:
      'Loader.io runs short-lived HTTP load tests from the cloud and provides basic result charts. It is designed for quick endpoint and application checks.',
    category: 'Cloud Load Testing',
    license: 'Freemium',
    pricingModel: 'Free tier with paid plans.',
    deployment: 'Cloud',
    scriptingLanguages: ['None'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Browser'],
    firstReleased: 2011,
    status: 'Active',
    cloudBased: true,
    tags: ['saas', 'http', 'quick-start'],
  }),
  makeTool({
    slug: 'redline13',
    name: 'RedLine13',
    vendor: 'RedLine13',
    url: 'https://www.redline13.com/',
    repoUrl: 'https://github.com/RedLine13/Redline13',
    description:
      'Freemium cloud load testing platform that runs tests in a customer AWS account.',
    longDescription:
      'RedLine13 provides a hosted load-testing service with AWS-based execution and integrations for JMeter and other load tools. Its companion GitHub repository contains open-source project components.',
    category: 'Load Testing',
    license: 'Freemium',
    pricingModel: 'Free trial and paid cloud plans.',
    deployment: 'Hybrid',
    scriptingLanguages: ['Java', 'Groovy'],
    protocols: ['HTTP', 'HTTPS', 'JDBC'],
    osSupport: ['Linux', 'Windows'],
    status: 'Active',
    tags: ['jmeter', 'aws', 'distributed'],
  }),
  makeTool({
    slug: 'nouvola',
    name: 'Nouvola',
    vendor: 'Nouvola',
    url: 'https://www.nouvola.com/',
    description:
      'Discontinued cloud performance testing platform for web, mobile, and API applications.',
    longDescription:
      'Nouvola was a cloud load testing and performance analytics service. Public company records report that Nouvola ceased operations.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel:
      'Historical commercial service; current pricing not verified.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Browser'],
    status: 'Discontinued',
    successor: 'No verified successor',
    cloudBased: true,
    tags: ['legacy', 'cloud'],
  }),
  makeTool({
    slug: 'stormforger',
    name: 'StormForger',
    vendor: 'StormForger',
    url: 'https://stormforger.com/',
    description:
      'Discontinued SaaS performance testing service acquired and rebranded as StormForge.',
    longDescription:
      'StormForger provided SaaS application performance testing. StormForge acquired the company in 2020 and integrated its technology into the StormForge platform.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel:
      'Historical commercial service; current pricing not verified.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Browser'],
    status: 'Discontinued',
    successor: 'StormForge',
    cloudBased: true,
    tags: ['legacy', 'ci-cd'],
  }),
  makeTool({
    slug: 'stresstimulus',
    name: 'StresStimulus',
    vendor: 'Stimulus Technology',
    url: 'https://www.stresstimulus.com/',
    description:
      'Windows load testing tool for web, REST, SOAP, and WCF applications.',
    longDescription:
      'StresStimulus records and replays browser and API traffic to create performance tests. It includes load generation, scheduling, and analysis features for Windows teams.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Free edition and paid licenses.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['C#', 'JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'REST', 'SOAP'],
    osSupport: ['Windows'],
    firstReleased: 2011,
    status: 'Active',
    tags: ['windows', 'api', 'recording'],
  }),
  makeTool({
    slug: 'roboswarm',
    name: 'RoboSwarm',
    vendor: 'RoboSwarm',
    url: 'https://roboswarm.com/',
    description:
      'Cloud load testing platform historically based on distributed Locust test clusters.',
    longDescription:
      'RoboSwarm was described by contemporary third-party coverage as a cloud service that provisioned distributed Locust clusters. The official site currently returns an access-denied response, so current availability remains unverified.',
    category: 'Browser/RUM',
    license: 'Commercial',
    pricingModel: 'Current pricing not verified.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Browser'],
    status: 'Unknown',
    cloudBased: true,
    tags: ['legacy', 'browser'],
  }),
  makeTool({
    slug: 'pureload',
    name: 'PureLoad',
    vendor: 'Emblasoft',
    url: 'https://www.pureload.com/',
    description:
      'Commercial functional and performance testing software for applications and mobile networks.',
    longDescription:
      'Emblasoft PureLoad supports functional and high-volume performance testing for applications and networks, including SIP, MSRP, HTTP, and Diameter.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Current pricing not verified.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Unknown'],
    protocols: ['HTTP', 'HTTPS', 'SIP', 'MSRP', 'Diameter'],
    osSupport: ['Windows'],
    status: 'Active',
    tags: ['legacy', 'enterprise'],
  }),
  makeTool({
    slug: 'grafana-k6',
    name: 'Grafana k6',
    vendor: 'Grafana Labs',
    url: 'https://grafana.com/docs/k6/latest/',
    repoUrl: 'https://github.com/grafana/k6',
    description:
      'Open-source developer-centric load testing tool with JavaScript or TypeScript test scripts.',
    longDescription:
      'Grafana k6 executes performance tests from concise JavaScript or TypeScript scenarios. It supports thresholds, checks, extensions, and integration with Grafana observability products.',
    category: 'Load Testing',
    license: 'Open Source',
    pricingModel: 'Free; AGPL-3.0 license.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['JavaScript', 'TypeScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'gRPC'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2017,
    status: 'Active',
    generalPick: true,
    personalPick: true,
    tags: ['javascript', 'cli', 'observability'],
  }),
  makeTool({
    slug: 'grafana-cloud-k6',
    name: 'Grafana Cloud k6',
    vendor: 'Grafana Labs',
    url: 'https://grafana.com/products/cloud/k6/',
    description:
      'Hosted Grafana service for running k6 tests with dashboards and distributed load generation.',
    longDescription:
      'Grafana Cloud k6 provides managed execution and results for k6 test scripts. It connects load testing data with Grafana dashboards, alerts, and other observability signals.',
    category: 'Cloud Load Testing',
    license: 'Freemium',
    pricingModel: 'Free tier with usage-based paid plans.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript', 'TypeScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'gRPC'],
    osSupport: ['Browser'],
    firstReleased: 2020,
    status: 'Active',
    cloudBased: true,
    tags: ['k6', 'saas', 'observability'],
  }),
  makeTool({
    slug: 'octoperf',
    name: 'OctoPerf',
    vendor: 'OctoPerf',
    url: 'https://octoperf.com/',
    description:
      'SaaS and on-premises performance testing platform built around Apache JMeter.',
    longDescription:
      'OctoPerf offers visual JMeter test design, cloud or private execution, and results analysis. It supports distributed load testing and CI/CD integrations.',
    category: 'Cloud Load Testing',
    license: 'Freemium',
    pricingModel: 'Free trial and paid plans.',
    deployment: 'Hybrid',
    scriptingLanguages: ['Java', 'Groovy'],
    protocols: ['HTTP', 'HTTPS', 'JDBC', 'JMS'],
    osSupport: ['Browser', 'Linux'],
    firstReleased: 2016,
    status: 'Active',
    tags: ['jmeter', 'saas', 'ci-cd'],
  }),
  makeTool({
    slug: 'webload',
    name: 'WebLOAD',
    vendor: 'RadView',
    url: 'https://www.radview.com/webload/',
    description:
      'Enterprise load testing solution for web, mobile, and API applications.',
    longDescription:
      'WebLOAD combines browser-based test design, load generation, and analytics. RadView offers the product for enterprise performance testing teams.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Free edition and commercial plans.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'REST'],
    osSupport: ['Windows', 'Linux'],
    firstReleased: 1997,
    status: 'Active',
    tags: ['enterprise', 'api', 'analytics'],
  }),
  makeTool({
    slug: 'load-multiplier',
    name: 'Load Multiplier',
    vendor: 'Load Multiplier',
    url: 'https://www.loadmultiplier.com/',
    description:
      'Discontinued hosted load testing product listed in the original QAInsights diagram.',
    longDescription:
      'Load Multiplier was listed as a cloud performance testing service in the source diagram. Its official domain no longer provides a verifiable product page.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel: 'Historical pricing not verified.',
    deployment: 'Cloud',
    scriptingLanguages: ['Unknown'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Browser'],
    status: 'Discontinued',
    successor: 'No verified successor',
    cloudBased: true,
    tags: ['legacy', 'cloud'],
  }),
  makeTool({
    slug: 'apica',
    name: 'Apica',
    vendor: 'Apica',
    url: 'https://www.apica.io/',
    description:
      'Observability platform with synthetic monitoring and load-testing capabilities for digital experiences.',
    longDescription:
      'Apica currently presents an observability platform with synthetic monitoring and a load test portal. Its services target web, API, and enterprise application performance workflows.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel: 'Commercial plans; contact vendor.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'REST'],
    osSupport: ['Browser'],
    status: 'Active',
    cloudBased: true,
    tags: ['monitoring', 'saas', 'enterprise'],
  }),
  makeTool({
    slug: 'wapt-pro',
    name: 'WAPT Pro',
    vendor: 'SoftLogica',
    url: 'https://www.loadtestingtool.com/',
    description:
      'Windows load testing tool for web applications, APIs, and web services.',
    longDescription:
      'WAPT Pro provides graphical recording, virtual users, test execution, and reporting. It is designed for Windows-based web performance testing teams.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Trial and commercial licenses.',
    deployment: 'Hybrid',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'REST', 'SOAP'],
    osSupport: ['Windows'],
    firstReleased: 2003,
    status: 'Active',
    tags: ['windows', 'web', 'recording'],
  }),
  makeTool({
    slug: 'frugal-testing',
    name: 'Frugal Testing',
    vendor: 'Frugal Testing',
    url: 'https://frugaltesting.com/',
    description:
      'Cloud-based performance testing service offering managed load generation and reporting.',
    longDescription:
      'Frugal Testing provides hosted performance testing with browser and API workflows. The service also offers testing services and consultation.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel: 'Commercial service and plans; contact vendor.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'REST'],
    osSupport: ['Browser'],
    status: 'Active',
    cloudBased: true,
    tags: ['saas', 'services', 'api'],
  }),
  makeTool({
    slug: 'agileload',
    name: 'AgileLoad',
    vendor: 'Quotium Technologies',
    url: 'https://www.agileload.com/',
    description:
      'Discontinued performance testing product formerly offered by Quotium Technologies.',
    longDescription:
      'AgileLoad was a Quotium performance testing product that ran on-premises or in the cloud. Quotium’s current QTest pages describe the successor product family.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Historical pricing not verified.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Windows'],
    status: 'Discontinued',
    successor: 'Quotium QTest',
    tags: ['legacy', 'enterprise'],
  }),
  makeTool({
    slug: 'loadstorm',
    name: 'LoadStorm',
    vendor: 'CustomerCentrix',
    url: 'https://loadstorm.com/',
    description: 'Cloud load testing service for web applications and APIs.',
    longDescription:
      'LoadStorm is a SaaS load testing product created and operated by CustomerCentrix for generating large volumes of web traffic.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel: 'Historical pricing not verified.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Browser'],
    status: 'Active',
    cloudBased: true,
    tags: ['legacy', 'cloud'],
  }),
  makeTool({
    slug: 'appvance-iq',
    name: 'Appvance AIQ',
    vendor: 'Appvance',
    url: 'https://appvance.ai/',
    description:
      'AI-assisted enterprise platform for functional, performance, security, and continuous testing.',
    longDescription:
      'Appvance IQ combines test creation and execution for web and enterprise applications. Appvance positions the platform for software quality and performance workflows.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Commercial plans; contact vendor.',
    deployment: 'Hybrid',
    scriptingLanguages: ['JavaScript', 'Java'],
    protocols: ['HTTP', 'HTTPS', 'REST'],
    osSupport: ['Windows', 'Linux'],
    status: 'Active',
    tags: ['enterprise', 'ai-assisted', 'api'],
  }),
  makeTool({
    slug: 'artillery',
    name: 'Artillery',
    vendor: 'Artillery Software',
    url: 'https://www.artillery.io/',
    repoUrl: 'https://github.com/artilleryio/artillery',
    description:
      'Developer-first load testing toolkit for HTTP, WebSocket, and messaging systems.',
    longDescription:
      'Artillery uses YAML configuration and JavaScript or TypeScript extensions to model traffic. It supports local and distributed tests plus CI/CD-oriented reporting.',
    category: 'Protocol/API Load',
    license: 'Open Source',
    pricingModel: 'Free open-source core; commercial cloud features available.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['JavaScript', 'TypeScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'Socket.IO', 'MQTT'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2016,
    status: 'Active',
    generalPick: true,
    tags: ['nodejs', 'api', 'javascript'],
  }),
  makeTool({
    slug: 'artillery-cloud',
    name: 'Artillery Cloud',
    vendor: 'Artillery Software',
    url: 'https://www.artillery.io/cloud',
    description:
      'Managed Artillery execution and observability for distributed performance tests.',
    longDescription:
      'Artillery Cloud runs Artillery scenarios on managed infrastructure and centralizes test results. It is designed for repeatable performance checks in development and CI pipelines.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel: 'Commercial plans; contact vendor.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript', 'TypeScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket'],
    osSupport: ['Browser'],
    status: 'Active',
    cloudBased: true,
    tags: ['artillery', 'saas', 'ci-cd'],
  }),
  makeTool({
    slug: 'rational-performance-tester',
    name: 'Rational Performance Tester',
    vendor: 'IBM',
    url: 'https://www.ibm.com/products/rational-performance-tester',
    description:
      'Enterprise performance testing software for web and service applications.',
    longDescription:
      'IBM Rational Performance Tester provides test authoring, execution, and analysis for enterprise applications. IBM documentation and product availability should be checked for current licensing.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Commercial license; request a quote.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Java'],
    protocols: ['HTTP', 'HTTPS', 'SOAP', 'JMS'],
    osSupport: ['Windows', 'Linux'],
    status: 'Discontinued',
    successor: 'IBM DevOps Test Performance',
    tags: ['ibm', 'enterprise', 'jvm'],
  }),
  makeTool({
    slug: 'loadster',
    name: 'Loadster',
    vendor: 'Loadster',
    url: 'https://loadster.app/',
    description:
      'Load testing application for browser-like web workflows and APIs.',
    longDescription:
      'Loadster provides a desktop and cloud workflow for creating traffic scenarios and running load tests. It targets web applications and API performance testing.',
    category: 'Browser/RUM',
    license: 'Commercial',
    pricingModel: 'Free trial and paid plans.',
    deployment: 'Hybrid',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    status: 'Active',
    tags: ['browser', 'api', 'desktop'],
  }),
  makeTool({
    slug: 'silk-performer',
    name: 'Silk Performer',
    vendor: 'OpenText',
    url: 'https://www.opentext.com/products/silk-performer',
    description:
      'Enterprise performance testing suite for web, mobile, and distributed applications.',
    longDescription:
      'Silk Performer supports visual scripting, protocol-based virtual users, distributed execution, and analysis. It is part of OpenText’s software quality portfolio.',
    category: 'Enterprise Suite',
    license: 'Commercial',
    pricingModel: 'Commercial license; request a quote.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['C', 'JavaScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket', 'SAP', 'Citrix'],
    osSupport: ['Windows'],
    firstReleased: 1996,
    status: 'Active',
    tags: ['enterprise', 'protocol', 'windows'],
  }),
  makeTool({
    slug: 'loadninja',
    name: 'LoadNinja',
    vendor: 'SmartBear',
    url: 'https://smartbear.com/product/loadninja/',
    description:
      'Cloud performance testing tool that uses real browsers and minimal scripting.',
    longDescription:
      'LoadNinja records browser interactions and runs tests using real browser instances. SmartBear positions it for web application performance testing and rapid test authoring.',
    category: 'Browser/RUM',
    license: 'Commercial',
    pricingModel: 'Commercial plans; contact vendor.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Browser'],
    status: 'Active',
    cloudBased: true,
    tags: ['browser', 'real-browser', 'smartbear'],
  }),
  makeTool({
    slug: 'azure-load-testing',
    name: 'Azure Load Testing',
    vendor: 'Microsoft',
    url: 'https://learn.microsoft.com/azure/load-testing/',
    description:
      'Fully managed Azure service for running high-scale Apache JMeter load tests.',
    longDescription:
      'Azure Load Testing provisions managed load infrastructure and integrates test results with Azure workflows. It supports Apache JMeter tests and CI/CD automation.',
    category: 'Cloud Load Testing',
    license: 'Commercial',
    pricingModel: 'Azure consumption-based pricing with free quota.',
    deployment: 'Cloud',
    scriptingLanguages: ['Java', 'Groovy'],
    protocols: ['HTTP', 'HTTPS', 'JDBC', 'JMS'],
    osSupport: ['Browser'],
    firstReleased: 2021,
    status: 'Active',
    cloudBased: true,
    tags: ['azure', 'jmeter', 'managed'],
  }),
  makeTool({
    slug: 'aws-distributed-load-testing',
    name: 'AWS Distributed Load Testing',
    vendor: 'Amazon Web Services',
    url: 'https://aws.amazon.com/solutions/implementations/distributed-load-testing-on-aws/',
    description:
      'AWS solution for deploying distributed load tests using containerized open-source engines.',
    longDescription:
      'Distributed Load Testing on AWS is an AWS Solutions implementation that provisions load generators and orchestration resources. It is commonly used with JMeter and other supported engines.',
    category: 'Cloud Load Testing',
    license: 'Open Source',
    pricingModel: 'Free solution code; pay AWS infrastructure costs.',
    deployment: 'Cloud',
    scriptingLanguages: ['Java', 'JavaScript'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Linux'],
    firstReleased: 2018,
    status: 'Active',
    cloudBased: true,
    tags: ['aws', 'distributed', 'infrastructure'],
  }),
  makeTool({
    slug: 'vegeta',
    name: 'Vegeta',
    vendor: 'tsenart',
    url: 'https://github.com/tsenart/vegeta',
    repoUrl: 'https://github.com/tsenart/vegeta',
    description:
      'HTTP load testing command-line utility designed for constant request rates.',
    longDescription:
      'Vegeta is a Go-based HTTP load testing tool with attack, report, and plotting commands. It is useful for repeatable endpoint benchmarks and rate-based tests.',
    category: 'Micro-benchmark CLI',
    license: 'Open Source',
    pricingModel: 'Free; MIT License.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Go'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2014,
    status: 'Active',
    personalPick: true,
    tags: ['go', 'cli', 'http'],
  }),
  makeTool({
    slug: 'wrk',
    name: 'wrk',
    vendor: 'wg / community',
    url: 'https://github.com/wg/wrk',
    repoUrl: 'https://github.com/wg/wrk',
    description:
      'Modern HTTP benchmarking tool capable of generating significant load from a single machine.',
    longDescription:
      'wrk is a multithreaded HTTP benchmarking tool with LuaJIT scripting for custom workloads. It emphasizes throughput and latency measurements for HTTP services.',
    category: 'Micro-benchmark CLI',
    license: 'Open Source',
    pricingModel: 'Free; Apache License 2.0.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['C', 'Lua'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['macOS', 'Linux'],
    firstReleased: 2012,
    status: 'Active',
    tags: ['c', 'cli', 'http'],
  }),
  makeTool({
    slug: 'hey',
    name: 'hey',
    vendor: 'rakyll / community',
    url: 'https://github.com/rakyll/hey',
    repoUrl: 'https://github.com/rakyll/hey',
    description:
      'Small command-line HTTP load generator for quick endpoint benchmarks.',
    longDescription:
      'hey is a simple Go utility for sending concurrent HTTP requests and reporting latency statistics. It is intended for quick checks rather than complex scenarios.',
    category: 'Micro-benchmark CLI',
    license: 'Open Source',
    pricingModel: 'Free; MIT License.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Go'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2016,
    status: 'Active',
    tags: ['go', 'cli', 'http'],
  }),
  makeTool({
    slug: 'bombardier',
    name: 'Bombardier',
    vendor: 'codesenberg',
    url: 'https://github.com/codesenberg/bombardier',
    repoUrl: 'https://github.com/codesenberg/bombardier',
    description: 'Fast cross-platform HTTP(S) benchmarking tool written in Go.',
    longDescription:
      'Bombardier generates HTTP and HTTPS traffic and reports latency, throughput, and status distributions. It supports command-line benchmarking for web endpoints.',
    category: 'Micro-benchmark CLI',
    license: 'Open Source',
    pricingModel: 'Free; MIT License.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Go'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2017,
    status: 'Active',
    tags: ['go', 'cli', 'http'],
  }),
  makeTool({
    slug: 'taurus',
    name: 'Taurus',
    vendor: 'BlazeMeter',
    url: 'https://gettaurus.org/',
    repoUrl: 'https://github.com/bzt/taurus',
    description:
      'Open-source automation framework that configures and runs multiple performance testing engines.',
    longDescription:
      'Taurus provides YAML-based declarative configuration for tools such as JMeter, Gatling, and Selenium. It standardizes execution and reporting for local or CI environments.',
    category: 'Load Testing',
    license: 'Open Source',
    pricingModel: 'Free; Apache License 2.0.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Python', 'YAML'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2013,
    status: 'Active',
    tags: ['automation', 'jmeter', 'ci-cd'],
  }),
  makeTool({
    slug: 'tsung',
    name: 'Tsung',
    vendor: 'Tsung community',
    url: 'https://tsung.erlang-projects.org/',
    repoUrl: 'https://github.com/processone/tsung',
    description:
      'Distributed open-source load testing tool for HTTP, WebDAV, LDAP, and other protocols.',
    longDescription:
      'Tsung is an Erlang-based distributed load testing tool. XML scenarios model users and support several network protocols with statistical reporting.',
    category: 'Protocol/API Load',
    license: 'Open Source',
    pricingModel: 'Free; GPL-2.0 license.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Erlang', 'XML'],
    protocols: ['HTTP', 'HTTPS', 'WebDAV', 'LDAP', 'XMPP'],
    osSupport: ['Linux', 'macOS'],
    firstReleased: 2001,
    status: 'Active',
    tags: ['erlang', 'distributed', 'protocol'],
  }),
  makeTool({
    slug: 'siege',
    name: 'Siege',
    vendor: 'Joe Dog Software',
    url: 'https://www.joedog.org/siege-home/',
    repoUrl: 'https://github.com/JoeDog/siege',
    description:
      'Open-source command-line utility for HTTP regression and benchmarking tests.',
    longDescription:
      'Siege is a command-line HTTP/HTTPS load and benchmarking tool. It supports concurrent users, URL lists, and basic response statistics.',
    category: 'Micro-benchmark CLI',
    license: 'Open Source',
    pricingModel: 'Free; GPL-3.0 license.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['C'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['macOS', 'Linux'],
    firstReleased: 2000,
    status: 'Active',
    tags: ['c', 'cli', 'http'],
  }),
  makeTool({
    slug: 'apachebench',
    name: 'ApacheBench (ab)',
    vendor: 'Apache Software Foundation',
    url: 'https://httpd.apache.org/docs/2.4/programs/ab.html',
    description:
      'Minimal HTTP server benchmarking command included with Apache HTTP Server.',
    longDescription:
      'ApacheBench sends configurable concurrent HTTP requests and summarizes throughput and timing. It is useful for simple endpoint benchmarks, not multi-step user journeys.',
    category: 'Micro-benchmark CLI',
    license: 'Open Source',
    pricingModel: 'Free; Apache License 2.0.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['C'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 1995,
    status: 'Active',
    tags: ['apache', 'cli', 'http'],
  }),
  makeTool({
    slug: 'fortio',
    name: 'Fortio',
    vendor: 'Fortio project',
    url: 'https://fortio.org/',
    repoUrl: 'https://github.com/fortio/fortio',
    description:
      'Fast, embeddable HTTP and gRPC load testing and latency tool.',
    longDescription:
      'Fortio provides a CLI, REST API, and web UI for generating traffic and measuring latency distributions. It supports HTTP, HTTPS, and gRPC workloads.',
    category: 'Protocol/API Load',
    license: 'Open Source',
    pricingModel: 'Free; Apache License 2.0.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Go'],
    protocols: ['HTTP', 'HTTPS', 'gRPC'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2017,
    status: 'Active',
    tags: ['go', 'grpc', 'service-mesh'],
  }),
  makeTool({
    slug: 'drill',
    name: 'Drill',
    vendor: 'Ferran Basora',
    url: 'https://github.com/fcsonline/drill',
    repoUrl: 'https://github.com/fcsonline/drill',
    description:
      'HTTP load testing application with YAML scenarios and a command-line interface.',
    longDescription:
      'Drill uses YAML files to describe HTTP requests and scenarios. It is a lightweight Rust-based option for repeatable API load tests.',
    category: 'Protocol/API Load',
    license: 'Open Source',
    pricingModel: 'Free; MIT License.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Rust', 'YAML'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['macOS', 'Linux'],
    firstReleased: 2015,
    status: 'Active',
    tags: ['rust', 'yaml', 'api'],
  }),
  makeTool({
    slug: 'goose',
    name: 'Goose',
    vendor: 'Tag1 Consulting',
    url: 'https://github.com/tag1consulting/goose',
    repoUrl: 'https://github.com/tag1consulting/goose',
    description:
      'Rust framework for building realistic, asynchronous load test clients.',
    longDescription:
      'Goose lets developers write load test behaviors in Rust and run them across distributed workers. It is suited to HTTP workloads requiring custom client logic.',
    category: 'Load Testing',
    license: 'Open Source',
    pricingModel: 'Free; GPL-3.0 license.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Rust'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2020,
    status: 'Active',
    tags: ['rust', 'distributed', 'code-first'],
  }),
  makeTool({
    slug: 'jmeter-plugins',
    name: 'JMeter Plugins',
    vendor: 'JMeter Plugins project',
    url: 'https://jmeter-plugins.org/',
    repoUrl: 'https://github.com/undera/jmeter-plugins',
    description:
      'Community plugin ecosystem extending Apache JMeter components, listeners, and load generators.',
    longDescription:
      'JMeter Plugins adds samplers, controllers, listeners, and utilities to Apache JMeter. It is an extension ecosystem rather than a standalone load testing engine.',
    category: 'Load Testing',
    license: 'Open Source',
    pricingModel: 'Free; mixed open-source licenses by plugin.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Java', 'Groovy'],
    protocols: ['HTTP', 'HTTPS', 'JDBC'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    status: 'Active',
    tags: ['jmeter', 'plugins', 'java'],
  }),
  makeTool({
    slug: 'wrk2',
    name: 'wrk2',
    vendor: 'Gil Tene / community',
    url: 'https://github.com/giltene/wrk2',
    repoUrl: 'https://github.com/giltene/wrk2',
    description:
      'Constant-throughput HTTP benchmark based on wrk for latency-oriented testing.',
    longDescription:
      'wrk2 extends wrk with a constant request rate and coordinated-omission-aware latency measurements. It is useful for controlled HTTP service benchmarks.',
    category: 'Micro-benchmark CLI',
    license: 'Open Source',
    pricingModel: 'Free; Apache License 2.0.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['C', 'Lua'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['macOS', 'Linux'],
    status: 'Active',
    tags: ['c', 'latency', 'http'],
  }),
  makeTool({
    slug: 'tcpkali',
    name: 'tcpkali',
    vendor: 'Machine Zone',
    url: 'https://github.com/machinezone/tcpkali',
    repoUrl: 'https://github.com/machinezone/tcpkali',
    description:
      'High-performance TCP and WebSocket load generator for connection-oriented services.',
    longDescription:
      'tcpkali creates large numbers of TCP or WebSocket connections and messages. It is designed for protocol-level capacity and connection testing.',
    category: 'Protocol/API Load',
    license: 'Open Source',
    pricingModel: 'Free; BSD 2-Clause License.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['C'],
    protocols: ['TCP', 'WebSocket'],
    osSupport: ['Linux', 'macOS'],
    firstReleased: 2015,
    status: 'Active',
    tags: ['websocket', 'tcp', 'connections'],
  }),
  makeTool({
    slug: 'ghz',
    name: 'ghz',
    vendor: 'Bojan Djurkovic',
    url: 'https://ghz.sh/',
    repoUrl: 'https://github.com/bojand/ghz',
    description:
      'Open-source command-line gRPC benchmarking and load testing tool.',
    longDescription:
      'ghz sends configurable gRPC requests and reports latency and status metrics. It supports scenarios, metadata, TLS, and output formats for automation.',
    category: 'Protocol/API Load',
    license: 'Open Source',
    pricingModel: 'Free; MIT License.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['Go', 'JavaScript'],
    protocols: ['gRPC', 'HTTP/2'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2018,
    status: 'Active',
    tags: ['grpc', 'go', 'cli'],
  }),
  makeTool({
    slug: 'autocannon',
    name: 'Autocannon',
    vendor: 'Matteo Collina',
    url: 'https://github.com/mcollina/autocannon',
    repoUrl: 'https://github.com/mcollina/autocannon',
    description:
      'Node.js HTTP/1.1 benchmarking tool optimized for quick, high-throughput tests.',
    longDescription:
      'Autocannon generates HTTP traffic from the command line or JavaScript API. It reports throughput and latency and is commonly used in Node.js development.',
    category: 'Micro-benchmark CLI',
    license: 'Open Source',
    pricingModel: 'Free; MIT License.',
    deployment: 'Self-hosted',
    scriptingLanguages: ['JavaScript', 'TypeScript'],
    protocols: ['HTTP', 'HTTPS'],
    osSupport: ['Windows', 'macOS', 'Linux'],
    firstReleased: 2017,
    status: 'Active',
    tags: ['nodejs', 'cli', 'http'],
  }),
  makeTool({
    slug: 'k6-cloud-legacy',
    name: 'k6 Cloud',
    vendor: 'Grafana Labs',
    url: 'https://grafana.com/products/cloud/k6/',
    description:
      'Former name for the hosted k6 service, now branded Grafana Cloud k6.',
    longDescription:
      'k6 Cloud was the earlier name of Grafana Labs’ hosted k6 offering. It has been renamed Grafana Cloud k6 and should not be treated as a separate current product.',
    category: 'Cloud Load Testing',
    license: 'Freemium',
    pricingModel: 'Use current Grafana Cloud k6 plans.',
    deployment: 'Cloud',
    scriptingLanguages: ['JavaScript', 'TypeScript'],
    protocols: ['HTTP', 'HTTPS', 'WebSocket'],
    osSupport: ['Browser'],
    status: 'Discontinued',
    successor: 'Grafana Cloud k6',
    cloudBased: true,
    tags: ['renamed', 'k6', 'legacy'],
  }),
];

const values = ['Open Source', 'Commercial', 'Freemium'];
const deployments = ['Cloud', 'Self-hosted', 'Hybrid'];
const statuses = ['Active', 'Discontinued', 'Unknown'];

export function validateTool(tool: Tool): boolean {
  return Boolean(
    tool.slug &&
      tool.name &&
      tool.vendor &&
      /^https?:\/\//.test(tool.url) &&
      tool.description.length <= 140 &&
      tool.longDescription.length > 0 &&
      values.includes(tool.license) &&
      deployments.includes(tool.deployment) &&
      statuses.includes(tool.status) &&
      Array.isArray(tool.scriptingLanguages) &&
      Array.isArray(tool.protocols) &&
      Array.isArray(tool.osSupport) &&
      Array.isArray(tool.tags) &&
      typeof tool.personalPick === 'boolean' &&
      typeof tool.generalPick === 'boolean' &&
      typeof tool.cloudBased === 'boolean' &&
      typeof tool.openSource === 'boolean' &&
      typeof tool.commercial === 'boolean',
  );
}
