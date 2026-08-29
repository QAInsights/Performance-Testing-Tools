import {
  TIER_A_COMPARISONS,
  type AlternativesHub,
  type ComparisonSpec,
} from '../data/comparisons';
import type { Category, Tool } from '../data/tools';
import { bestFor, notBestFor } from './toolEntity';

/**
 * Tier-B pages are derived from recorded catalog facts rather than hand
 * written. Every sentence must be traceable to a field on `Tool`, and a pair
 * or hub that cannot clear the gates below is not emitted at all.
 */
const MIN_DECISIONS = 4;
const MIN_SWITCH_TRIGGERS = 3;
const MAX_DERIVED_PAIRS = 48;
/** Keeps one popular tool from pairing with the whole catalog. */
const MAX_PAIRS_PER_TOOL = 8;
const MIN_HUB_PEERS = 5;
/** Matches the number of alternatives rendered on a hub page. */
const HUB_LIST_LIMIT = 12;

/**
 * Curator judgment, ordered by how often the tool is actually searched as a
 * shortlist candidate. Only these tools get derived comparison and
 * alternatives pages: pairing a well-known tool with every obscure entry in
 * the catalog would be scaled thin content, not coverage.
 */
const NOTABLE_TOOLS: readonly string[] = [
  'apache-jmeter',
  'grafana-k6',
  'gatling',
  'locust',
  'artillery',
  'loadrunner-professional',
  'neoload',
  'blazemeter',
  'taurus',
  'wrk',
  'vegeta',
  'hey',
  'apachebench',
  'autocannon',
  'bombardier',
  'siege',
  'tsung',
  'the-grinder',
  'ngrinder',
  'azure-load-testing',
  'aws-distributed-load-testing',
  'grafana-cloud-k6',
  'octoperf',
  'loadview',
  'loadninja',
  'k6-cloud-legacy',
  'flood',
  'gatling-enterprise',
  'loadrunner-enterprise',
  'loadrunner-cloud',
  'silk-performer',
  'webload',
  'loaderio',
  'redline13',
  'goose',
  'ghz',
  'fortio',
  'oha',
  'drill',
  'wrk2',
  'jmeter-java-dsl',
  'yandex-tank',
  'goreplay',
  'molotov',
  'grafana-k6-browser',
  'rational-performance-tester',
  'apica',
  'xlt',
];

const CATEGORY_NOUN: Record<Category, string> = {
  'Load Testing': 'load testing tool',
  'Protocol/API Load': 'protocol and API load tool',
  'Micro-benchmark CLI': 'micro-benchmark CLI',
  'Cloud Load Testing': 'cloud load testing service',
  'Enterprise Suite': 'enterprise performance suite',
  'Browser/RUM': 'browser and real-user monitoring tool',
  'Results Analysis': 'results analysis tool',
  'AI/LLM Inference': 'LLM inference benchmarking tool',
};

/** Categories whose tools are routinely shortlisted against each other. */
const LOAD_FAMILY: Category[] = [
  'Load Testing',
  'Protocol/API Load',
  'Cloud Load Testing',
  'Enterprise Suite',
  'Micro-benchmark CLI',
];

const LICENSE_ADJECTIVE = {
  'Open Source': 'open source',
  Commercial: 'commercial',
  Freemium: 'freemium',
} as const;

const DEPLOYMENT_ADJECTIVE = {
  'Self-hosted': 'self-hosted',
  Cloud: 'vendor-hosted',
  Hybrid: 'self-hosted or vendor-hosted',
} as const;

const article = (word: string) => (/^[aeiou]/i.test(word) ? 'an' : 'a');

const list = (values: readonly string[], limit = 3) =>
  values.slice(0, limit).join(', ');

const sentence = (text: string) => text.replace(/\.*$/, '.');

const notableRank = (tool: Tool) => NOTABLE_TOOLS.indexOf(tool.slug);

const isNotable = (tool: Tool) => notableRank(tool) >= 0;

const onlyIn = (tool: Tool, other: Tool) =>
  tool.protocols.filter((protocol) => !other.protocols.includes(protocol));

const sharedProtocols = (left: Tool, right: Tool) =>
  left.protocols.filter((protocol) => right.protocols.includes(protocol));

const hasSuccessor = (tool: Tool) =>
  tool.successor && !/^no verified/i.test(tool.successor)
    ? tool.successor
    : undefined;

/** Same-category peers first, then by how often the tool is searched. */
const byProximity = (base: Tool) => (a: Tool, b: Tool) => {
  const sameCategory = (tool: Tool) =>
    tool.category === base.category ? 0 : 1;
  return sameCategory(a) - sameCategory(b) || byNotability(a, b);
};

const byNotability = (a: Tool, b: Tool) => {
  const rankA = notableRank(a);
  const rankB = notableRank(b);
  if (rankA !== rankB) {
    if (rankA < 0) return 1;
    if (rankB < 0) return -1;
    return rankA - rankB;
  }
  return a.name.localeCompare(b.name);
};

/** One factual sentence describing a tool, built only from catalog fields. */
export function toolSentence(tool: Tool): string {
  const licence = LICENSE_ADJECTIVE[tool.license];
  const noun = `${licence}, ${DEPLOYMENT_ADJECTIVE[tool.deployment]} ${CATEGORY_NOUN[tool.category]}`;
  const scripting = tool.scriptingLanguages.length
    ? `, scripted in ${list(tool.scriptingLanguages)}`
    : ', driven from the command line';
  const status = tool.status === 'Discontinued' ? ' It is discontinued.' : '';
  return `${tool.name} is ${article(licence)} ${noun} from ${tool.vendor}${scripting}.${status}`;
}

function splitSentence(left: Tool, right: Tool): string {
  if (left.license !== right.license) {
    return `The practical split is the cost model: ${left.name} is ${LICENSE_ADJECTIVE[left.license]}, ${right.name} is ${LICENSE_ADJECTIVE[right.license]}.`;
  }
  if (left.deployment !== right.deployment) {
    const hosted = left.deployment === 'Cloud' ? left : right;
    const owned = hosted.slug === left.slug ? right : left;
    return `The practical split is who runs the load generators: ${owned.name} on your own infrastructure, ${hosted.name} on the vendor's.`;
  }
  if (
    left.scriptingLanguages.length &&
    right.scriptingLanguages.length &&
    left.scriptingLanguages.join() !== right.scriptingLanguages.join()
  ) {
    return `The practical split is the authoring language: ${list(left.scriptingLanguages)} for ${left.name}, ${list(right.scriptingLanguages)} for ${right.name}.`;
  }
  const leftOnly = onlyIn(left, right);
  const rightOnly = onlyIn(right, left);
  return `The practical split is protocol coverage: ${leftOnly.length ? `${left.name} additionally records ${list(leftOnly)}` : `${left.name} stays narrower`}, ${rightOnly.length ? `${right.name} additionally records ${list(rightOnly)}` : `${right.name} stays narrower`}.`;
}

function verdictParagraph(left: Tool, right: Tool): string {
  const common = sharedProtocols(left, right);
  const overlap = common.length
    ? `Both cover ${list(common, 4)}${left.category === right.category ? `, and both sit in the ${CATEGORY_NOUN[left.category]} bracket` : ''}.`
    : 'They get shortlisted together despite little recorded protocol overlap, so check your own protocol list before anything else.';

  const dead = [left, right].find((tool) => tool.status === 'Discontinued');
  const alive = dead ? (dead.slug === left.slug ? right : left) : undefined;
  const lifecycle =
    dead && alive
      ? ` ${dead.name} is discontinued${hasSuccessor(dead) ? ` with ${hasSuccessor(dead)} named as its successor` : ''}, so ${alive.name} is the safer default for new work.`
      : '';

  const [broad, narrow] =
    left.protocols.length >= right.protocols.length
      ? [left, right]
      : [right, left];
  const breadth =
    broad.protocols.length > narrow.protocols.length
      ? ` On recorded coverage ${broad.name} is the wider of the two (${broad.protocols.length} protocols against ${narrow.protocols.length}), which matters only if your workload actually uses the extra ones.`
      : ` Recorded protocol coverage is the same width on both sides (${left.protocols.length} protocols), so breadth is not the deciding factor here.`;

  const closing =
    left.license !== right.license
      ? ` Budget and procurement usually settle ${left.name} against ${right.name} before any benchmark does.`
      : left.deployment !== right.deployment
        ? ` Data residency and who operates the generators usually settle ${left.name} against ${right.name}.`
        : ` Team language and existing tooling usually settle ${left.name} against ${right.name}.`;

  return `${overlap}${breadth}${lifecycle}${closing} Run the same scenario on both before you standardize; the rows below only tell you what is true on paper.`;
}

function decisionBullets(left: Tool, right: Tool): string[] {
  const bullets: string[] = [];

  if (left.license !== right.license) {
    for (const tool of [left, right]) {
      bullets.push(
        tool.license === 'Open Source'
          ? `Choose ${tool.name} if you need a free, self-supported stack (${sentence(tool.pricingModel)})`
          : tool.license === 'Freemium'
            ? `Choose ${tool.name} if a free tier ahead of paid capacity suits you (${sentence(tool.pricingModel)})`
            : `Choose ${tool.name} if you can fund a commercial license for vendor support (${sentence(tool.pricingModel)})`,
      );
    }
  }

  if (left.deployment !== right.deployment) {
    const hosted = left.deployment === 'Cloud' ? left : right;
    const owned = hosted.slug === left.slug ? right : left;
    bullets.push(
      `Pick ${hosted.name} to avoid operating injectors, ${owned.name} when residency or air-gapped runs rule a hosted service out.`,
    );
  }

  for (const [tool, other] of [
    [left, right],
    [right, left],
  ] as const) {
    const unique = onlyIn(tool, other);
    if (unique.length) {
      bullets.push(
        `Only ${tool.name} records support for ${list(unique)} — one hard requirement there decides the pair on its own.`,
      );
    }
  }

  if (
    left.scriptingLanguages.length &&
    right.scriptingLanguages.length &&
    left.scriptingLanguages.join() !== right.scriptingLanguages.join()
  ) {
    bullets.push(
      `Match the authoring language to the team: ${left.name} means ${list(left.scriptingLanguages)}, ${right.name} means ${list(right.scriptingLanguages)}.`,
    );
  }

  for (const tool of [left, right]) {
    if (tool.status === 'Discontinued') {
      const successor = hasSuccessor(tool);
      bullets.push(
        successor
          ? `${tool.name} is discontinued; migrations off it usually land on ${successor}.`
          : `${tool.name} is discontinued, so treat it as a maintenance-only option.`,
      );
    }
  }

  bullets.push(
    'Open the Test Rig to compare license, deployment, protocol and OS rows side by side.',
  );
  return bullets;
}

function differenceCount(left: Tool, right: Tool): number {
  return [
    left.license !== right.license,
    left.deployment !== right.deployment,
    left.category !== right.category,
    left.status !== right.status,
    left.scriptingLanguages.join() !== right.scriptingLanguages.join(),
    onlyIn(left, right).length > 0 || onlyIn(right, left).length > 0,
  ].filter(Boolean).length;
}

function comparable(left: Tool, right: Tool): boolean {
  if (!isNotable(left) || !isNotable(right)) return false;
  if (!left.protocols.length || !right.protocols.length) return false;
  if (left.status !== 'Active' && right.status !== 'Active') return false;
  const sameBracket =
    left.category === right.category ||
    (LOAD_FAMILY.includes(left.category) &&
      LOAD_FAMILY.includes(right.category) &&
      sharedProtocols(left, right).length > 0);
  return sameBracket && differenceCount(left, right) >= 2;
}

export function derivedPairPath(left: Tool, right: Tool): string {
  return `${left.slug}-vs-${right.slug}`;
}

/**
 * Deterministic tier-B pairs: most-searched tools first, capped per tool so no
 * single tool spawns a page against everything, and excluding any pair already
 * covered by a hand-written tier-A spec.
 */
export function derivedComparisons(
  catalog: readonly Tool[],
  limit = MAX_DERIVED_PAIRS,
): ComparisonSpec[] {
  const covered = new Set(
    TIER_A_COMPARISONS.map((spec) =>
      [spec.leftSlug, spec.rightSlug].sort().join('|'),
    ),
  );
  const ranked = [...catalog].filter(isNotable).sort(byNotability);
  const candidates: Array<{ left: Tool; right: Tool; score: number }> = [];

  for (let i = 0; i < ranked.length; i += 1) {
    for (let j = i + 1; j < ranked.length; j += 1) {
      const left = ranked[i];
      const right = ranked[j];
      if (covered.has([left.slug, right.slug].sort().join('|'))) continue;
      if (!comparable(left, right)) continue;
      candidates.push({
        left,
        right,
        score: notableRank(left) + notableRank(right),
      });
    }
  }

  candidates.sort(
    (a, b) =>
      a.score - b.score ||
      a.left.slug.localeCompare(b.left.slug) ||
      a.right.slug.localeCompare(b.right.slug),
  );

  const perTool = new Map<string, number>();
  const specs: ComparisonSpec[] = [];
  for (const { left, right } of candidates) {
    if (specs.length >= limit) break;
    const leftCount = perTool.get(left.slug) ?? 0;
    const rightCount = perTool.get(right.slug) ?? 0;
    if (leftCount >= MAX_PAIRS_PER_TOOL || rightCount >= MAX_PAIRS_PER_TOOL)
      continue;
    const decisions = decisionBullets(left, right);
    if (decisions.length < MIN_DECISIONS) continue;
    perTool.set(left.slug, leftCount + 1);
    perTool.set(right.slug, rightCount + 1);
    specs.push({
      pairPath: derivedPairPath(left, right),
      leftSlug: left.slug,
      rightSlug: right.slug,
      leftLabel: left.name,
      rightLabel: right.name,
      answerBox: `${toolSentence(left)} ${toolSentence(right)} ${splitSentence(left, right)}`,
      verdict: verdictParagraph(left, right),
      decisions,
      tier: 'B',
    });
  }
  return specs;
}

/**
 * Peers a hub both names in its intro and renders in its list — one ordering,
 * so the prose and the page agree.
 */
export function hubPeers(tool: Tool, catalog: readonly Tool[]): Tool[] {
  return catalog
    .filter(
      (peer) =>
        peer.slug !== tool.slug &&
        peer.status === 'Active' &&
        isNotable(peer) &&
        (peer.category === tool.category ||
          (LOAD_FAMILY.includes(peer.category) &&
            LOAD_FAMILY.includes(tool.category) &&
            sharedProtocols(peer, tool).length > 0)),
    )
    .sort(byProximity(tool))
    .slice(0, HUB_LIST_LIMIT);
}

function hubIntro(tool: Tool, peers: readonly Tool[]): string {
  const successor = hasSuccessor(tool);
  const reason =
    tool.status === 'Discontinued'
      ? `Searches for ${tool.name} alternatives are migration searches now: it is discontinued${successor ? `, with ${successor} named as the successor` : ' with no verified successor'}.`
      : tool.license === 'Commercial'
        ? `Teams look for ${tool.name} alternatives mostly on license cost, then on deployment fit.`
        : tool.deployment === 'Cloud'
          ? `Teams look for ${tool.name} alternatives when a hosted service stops fitting residency, budget, or CI constraints.`
          : `Teams look for ${tool.name} alternatives when the operating burden, the authoring language, or protocol coverage stops fitting.`;
  const names = peers.slice(0, 4).map((peer) => peer.name);
  const extra = peers.length - names.length;
  return `${toolSentence(tool)} ${reason} The closest recorded substitutes are ${list(names, 4)}${extra > 0 ? `, plus ${extra} more below` : ''} — ranked here on license, deployment, scripting and protocols rather than on popularity.`;
}

function hubSwitchTriggers(tool: Tool, peers: readonly Tool[]): string[] {
  const triggers = notBestFor(tool).map(sentence);
  const pick = (match: (peer: Tool) => boolean) => peers.find(match);

  const openSource = pick(
    (peer) => peer.license === 'Open Source' && tool.license !== 'Open Source',
  );
  if (openSource) {
    triggers.push(
      `Budget is the constraint: ${openSource.name} covers overlapping ground under an open-source license.`,
    );
  }

  const commercial = pick(
    (peer) => peer.license === 'Commercial' && tool.license !== 'Commercial',
  );
  if (commercial) {
    triggers.push(
      `You need a vendor contract and support path: ${commercial.name} is sold commercially.`,
    );
  }

  const hosted = pick(
    (peer) => peer.deployment === 'Cloud' && tool.deployment !== 'Cloud',
  );
  if (hosted) {
    triggers.push(
      `You would rather not run generators at all: ${hosted.name} is vendor-hosted.`,
    );
  }

  const selfHosted = pick(
    (peer) => peer.deployment === 'Self-hosted' && tool.deployment === 'Cloud',
  );
  if (selfHosted) {
    triggers.push(
      `Data has to stay inside your perimeter: ${selfHosted.name} is self-hosted.`,
    );
  }

  const broader = peers.find((peer) => onlyIn(peer, tool).length >= 2);
  if (broader) {
    triggers.push(
      `Your protocol list runs past ${tool.name}: ${broader.name} also records ${list(onlyIn(broader, tool))}.`,
    );
  }

  const otherLanguage = peers.find(
    (peer) =>
      peer.scriptingLanguages.length &&
      !peer.scriptingLanguages.some((language) =>
        tool.scriptingLanguages.includes(language),
      ),
  );
  if (otherLanguage) {
    triggers.push(
      `The team would rather author in ${list(otherLanguage.scriptingLanguages, 2)}: that is ${otherLanguage.name}.`,
    );
  }

  return triggers.slice(0, 5);
}

/**
 * Hubs for tools that are genuinely searched as a baseline — a notable active
 * tool, or a notable discontinued one where the intent is migration — and only
 * where the catalog holds enough same-category peers to make a real list.
 */
export function derivedAlternativesHubs(
  catalog: readonly Tool[],
  existing: readonly AlternativesHub[],
): AlternativesHub[] {
  const covered = new Set(existing.map((hub) => hub.toolSlug));
  return catalog
    .filter((tool) => !covered.has(tool.slug) && isNotable(tool))
    .sort(byNotability)
    .map((tool) => ({ tool, peers: hubPeers(tool, catalog) }))
    .filter(({ peers }) => peers.length >= MIN_HUB_PEERS)
    .map(({ tool, peers }) => ({
      toolSlug: tool.slug,
      headline: `${tool.name} alternatives`,
      intro: hubIntro(tool, peers),
      whenToStay: bestFor(tool).map(sentence),
      whenToSwitch: hubSwitchTriggers(tool, peers),
      tier: 'B' as const,
    }))
    .filter(
      (hub) =>
        hub.whenToStay.length >= 2 &&
        hub.whenToSwitch.length >= MIN_SWITCH_TRIGGERS,
    );
}
