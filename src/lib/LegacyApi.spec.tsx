import { login } from './LegacyApi';
import { waitFor } from '@testing-library/react';
import { expect, it, describe } from 'vitest';

describe('LegacyApi', () => {
	it('stores session token on successful login', async () => {
		fetchMock.mockResponse('token');

		await login('test', 'test');

		await waitFor(() => {
			expect(window.localStorage.getItem('token')).toBe('token');
		});
	});

	it('stores session email on successful login', async () => {
		fetchMock.mockResponse('token');

		await login('test', 'test');

		await waitFor(() => {
			expect(window.localStorage.getItem('email')).toBe('test');
		});
	});
});
