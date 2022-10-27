import { ParsedQuery } from 'query-string';
import browser from '../Browser';
import { vi } from 'vitest';

export const loadUrlParams = (params: ParsedQuery): void => {
	vi.spyOn(browser, 'getUrlParams').mockReturnValue(params);
};
