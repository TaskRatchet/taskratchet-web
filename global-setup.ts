import createFetchMock from 'vitest-fetch-mock';
import { vi, beforeEach, expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { redirectToCheckout } from './src/react/lib/stripe';
import { getCheckoutSession } from '@taskratchet/sdk';

afterEach(() => {
	cleanup();
});

expect.extend(matchers);

// eslint-disable-next-line @typescript-eslint/require-await
module.exports = async () => {
	process.env.TZ = 'America/Chicago';
};

vi.mock('./src/react/lib/saveFeedback');
vi.mock('./src/react/lib/stripe');
vi.mock('@mui/x-date-pickers');
vi.mock('@taskratchet/sdk');

global.scrollTo = vi.fn() as any;

function deleteAllCookies() {
	const cookies = document.cookie.split(';');

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
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
});
