import { siteOrigin } from '../config/site';
import { buildLlmsFullTxt } from '../lib/llmsGenerated';

export function GET() {
  return new Response(buildLlmsFullTxt(undefined, siteOrigin), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
