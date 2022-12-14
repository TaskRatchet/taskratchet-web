import { login } from './login';
import { waitFor } from '@testing-library/react';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import { signInWithEmailAndPassword } from 'firebase/auth';

vi.mock('firebase/auth');

describe('login', () => {
	beforeEach(() => {
		vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
			user: {
				getIdToken: () => Promise.resolve('token'),
			},
		} as any);
	});

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
