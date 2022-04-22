import { LegacyApi } from './LegacyApi';
import { waitFor } from '@testing-library/dom';

describe('LegacyApi', () => {
	it('should be defined', () => {
		expect(LegacyApi).toBeDefined();
	});

	it('stores session token on successful login', async () => {
		fetchMock.mockResponse('token');

		const api = new LegacyApi();
		await api.login('test', 'test');

		await waitFor(() => {
			expect(window.localStorage.getItem('token')).toBe('token');
		});
	});

	it('stores session email on successful login', async () => {
		fetchMock.mockResponse('token');

		const api = new LegacyApi();
		await api.login('test', 'test');

		await waitFor(() => {
			expect(window.localStorage.getItem('email')).toBe('test');
		});
	});
});
