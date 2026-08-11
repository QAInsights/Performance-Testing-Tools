import { joinBase, siteBase } from '../../src/config/site';

export const sitePath = (path = '') => joinBase(path, siteBase);
