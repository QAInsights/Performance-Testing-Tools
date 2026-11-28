import {
  buildClickEvent,
  classifyAiReferral,
  pageTypeFromPath,
} from '../lib/analytics';

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { gtag?: Gtag };

const sendEvent = (name: string, params: Record<string, string>): void => {
  const gtag = (window as AnalyticsWindow).gtag;
  if (!gtag) return;
  gtag('event', name, params);
};

export function initAnalytics(): void {
  const pageType = pageTypeFromPath(window.location.pathname);
  const aiReferral = classifyAiReferral(document.referrer);
  sendEvent('page_intent', {
    page_type: pageType,
    ai_referral: aiReferral ?? 'none',
  });
  if (aiReferral) {
    sendEvent('ai_referral', {
      source: aiReferral,
      page_type: pageType,
    });
  }
  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>(
        '[data-analytics-event]',
      );
      if (!target) return;
      const built = buildClickEvent(target, window.location.pathname);
      if (!built) return;
      sendEvent(built.name, built.params);
    },
    true,
  );
}

initAnalytics();
