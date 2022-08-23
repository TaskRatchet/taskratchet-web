import createFetchMock from 'vitest-fetch-mock';
import { vi, beforeEach, expect, afterEach } from 'vitest';
import matchers, {
	TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

afterEach(() => {
	cleanup();
});

const m: TestingLibraryMatchers<string, void> = matchers;

expect.extend(m);

// eslint-disable-next-line @typescript-eslint/require-await
module.exports = async () => {
	process.env.TZ = 'America/Chicago';
};

// vi.mock('react', async () => ({
// 	...(await vi.importActual('react')),
// 	useLayoutEffect: (await vi.importActual('react')).useEffect,
// }));

vi.mock('@mui/x-date-pickers');

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
});
