import { siteOrigin } from '../config/site';
import { buildLlmsTxt } from '../lib/llmsGenerated';

export function GET() {
  return new Response(buildLlmsTxt(undefined, siteOrigin), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
