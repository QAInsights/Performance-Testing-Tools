import { siteBase } from '../config/site';

export function siteUrl(path = ''): string {
  return `${siteBase}/${path.replace(/^\//, '')}`;
}
