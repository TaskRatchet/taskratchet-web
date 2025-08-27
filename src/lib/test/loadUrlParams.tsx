import type { ParsedQuery } from 'query-string';
import { vi } from 'vitest';

import * as browser from '../browser';

export const loadUrlParams = (params: ParsedQuery): void => {
	vi.spyOn(browser, 'getUrlParams').mockReturnValue(params);
};
