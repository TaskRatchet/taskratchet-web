import createFetchMock from 'vitest-fetch-mock';
import { vi, beforeEach, expect, afterEach } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

afterEach(() => {
	cleanup();
});

expect.extend(matchers);

module.exports = async () => {
	process.env.TZ = 'America/Chicago';
};

vi.mock('react', async () => ({
	...(await vi.importActual('react')),
	useLayoutEffect: (await vi.importActual('react')).useEffect,
}));

// vi.mock('@mui/x-date-pickers', async () => {
// 	const dp = await vi.importActual('@mui/x-date-pickers/DesktopDatePicker');
// 	const tp = await vi.importActual('@mui/x-date-pickers/DesktopTimePicker');
// 	const og = await vi.importActual('@mui/x-date-pickers');

// 	return {
// 		...og,
// 		DatePicker: dp.DesktopDatePicker,
// 		TimePicker: tp.DesktopTimePicker,
// 	};
// });

vi.mock('@mui/x-date-pickers');

global.scrollTo = vi.fn();

function deleteAllCookies() {
	var cookies = document.cookie.split(';');

	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf('=');
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
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
