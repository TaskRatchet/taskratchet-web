import type { ParsedQuery } from 'query-string';
import * as browser from '../browser';
import { vi } from 'vitest';

export const loadUrlParams = (params: ParsedQuery): void => {
	vi.spyOn(browser, 'getUrlParams').mockReturnValue(params);
};
