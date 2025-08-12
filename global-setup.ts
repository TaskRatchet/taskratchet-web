import { getCheckoutSession } from '@taskratchet/sdk';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import * as browser from './src/lib/browser';
import { redirectToCheckout } from './src/lib/stripe';

afterEach(() => {
	cleanup();
});

expect.extend(matchers);

// eslint-disable-next-line @typescript-eslint/require-await
module.exports = async () => {
	process.env.TZ = 'America/Chicago';
};

vi.mock('./src/lib/saveFeedback');
vi.mock('./src/lib/stripe');
vi.mock('@mui/x-date-pickers');
vi.mock('@taskratchet/sdk');
vi.mock('@clerk/clerk-react');

global.scrollTo = vi.fn() as any;

function deleteAllCookies() {
	const cookies = document.cookie.split(';');

	for (const cookie of cookies) {
		const eqPos = cookie.indexOf('=');
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

beforeEach(() => {
	fetchMock.resetMocks();
	deleteAllCookies();
	window.localStorage.clear();
	vi.mocked(getCheckoutSession).mockResolvedValue({
		id: 'session',
	});
	vi.mocked(redirectToCheckout).mockResolvedValue();
	vi.spyOn(browser, 'prefersDarkMode').mockReturnValue(false);
});
