import createFetchMock from 'vitest-fetch-mock';
import { vi, beforeEach, expect, afterEach } from 'vitest';
import matchers, {
	TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { getCheckoutSession } from './src/lib/api/getCheckoutSession';
import { redirectToCheckout } from './src/lib/stripe';

afterEach(() => {
	cleanup();
});

const m: TestingLibraryMatchers<string, void> = matchers;

expect.extend(m);

// eslint-disable-next-line @typescript-eslint/require-await
module.exports = async () => {
	process.env.TZ = 'America/Chicago';
};

vi.mock('@mui/x-date-pickers');
vi.mock('./src/lib/api/getTimezones');
vi.mock('./src/lib/api/getCheckoutSession');
vi.mock('./src/lib/stripe');
vi.mock('./src/lib/api/getTasks');
vi.mock('./src/lib/api/getMe');
vi.mock('./src/lib/api/updateTask');
vi.mock('./src/lib/api/addTask');
vi.mock('react-list');

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
	vi.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));

	vi.mocked(getCheckoutSession).mockResolvedValue({
		id: 'session',
	});
	vi.mocked(redirectToCheckout).mockResolvedValue();
});
