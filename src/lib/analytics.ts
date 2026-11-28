import { siteBase } from '../config/site';

export interface AnalyticsEvent {
  name: string;
  params: Record<string, string>;
}

export interface AnalyticsTarget {
  dataset: Record<string, string | undefined>;
  getAttribute(name: string): string | null;
}

const SAFE_PARAM = /^[a-z0-9_.:-]{1,64}$/;
const AI_REFERRAL_DOMAINS = [
  ['chatgpt.com', 'chatgpt'],
  ['perplexity.ai', 'perplexity'],
  ['claude.ai', 'claude'],
  ['copilot.microsoft.com', 'copilot'],
  ['gemini.google.com', 'gemini'],
] as const;
const CLICK_FIELDS = [
  ['cta', 'analyticsCta'],
  ['label', 'analyticsLabel'],
  ['slot', 'analyticsSlot'],
  ['placement', 'analyticsPlacement'],
  ['pair', 'analyticsPair'],
] as const;

export function safeParam(
  value: string | null | undefined,
): string | undefined {
  const normalized = (value ?? '').trim().toLowerCase();
  return SAFE_PARAM.test(normalized) ? normalized : undefined;
}

export function classifyAiReferral(referrer: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    for (const [domain, label] of AI_REFERRAL_DOMAINS) {
      if (host === domain || host.endsWith(`.${domain}`)) return label;
    }
    return null;
  } catch {
    return null;
  }
}

export function pageTypeFromPath(pathname: string, base = siteBase): string {
  const normalizedBase = base === '/' ? '' : base.replace(/^\/+|\/+$/g, '');
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const path =
    normalizedBase &&
    (cleanPath === `/${normalizedBase}` ||
      cleanPath.startsWith(`/${normalizedBase}/`))
      ? cleanPath.slice(normalizedBase.length + 1) || '/'
      : cleanPath;
  if (path === '/' || path.endsWith('/index')) return 'home';
  if (path.startsWith('/vs/')) return 'vs';
  if (path.startsWith('/alternatives/')) return 'alternatives';
  if (path.startsWith('/guides/')) return 'guide';
  if (path.startsWith('/reports/')) return 'report';
  if (path === '/sponsors') return 'sponsors';
  if (path.startsWith('/tools/')) return 'tool';
  if (path === '/reviews' || path.startsWith('/reviews/')) return 'review';
  if (
    path.startsWith('/protocols/') ||
    path.startsWith('/languages/') ||
    path.startsWith('/deployment/')
  )
    return 'landing';
  return 'directory';
}

export function buildClickEvent(
  target: AnalyticsTarget,
  pathname: string,
): AnalyticsEvent | null {
  const name = safeParam(target.dataset.analyticsEvent);
  if (!name) return null;
  const params: Record<string, string> = {
    page_type: pageTypeFromPath(pathname),
  };
  for (const [param, datasetKey] of CLICK_FIELDS) {
    const value = safeParam(target.dataset[datasetKey]);
    if (value) params[param] = value;
  }
  return { name, params };
}
