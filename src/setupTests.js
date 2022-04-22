import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

jest.mock('react', () => ({
	...jest.requireActual('react'),
	useLayoutEffect: jest.requireActual('react').useEffect,
}));

jest.mock('@mui/lab/DatePicker', () => {
	return jest.requireActual('@mui/lab/DesktopDatePicker');
});

jest.mock('@mui/lab/TimePicker', () => {
	return jest.requireActual('@mui/lab/DesktopTimePicker');
});

global.scrollTo = jest.fn();

function deleteAllCookies() {
	var cookies = document.cookie.split(';');

	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf('=');
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}

fetchMock.enableMocks();

beforeEach(() => {
	fetch.resetMocks();
	deleteAllCookies();
});
