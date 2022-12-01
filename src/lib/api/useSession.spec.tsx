import { logout, useSession } from './useSession';
import { act, renderHook } from '@testing-library/react';
import { expect, it, describe } from 'vitest';

describe('useSession', () => {
	it('should return the session', () => {
		const session = {
			email: 'the_email',
			token: 'the_token',
		};
		window.localStorage.setItem('email', session.email);
		window.localStorage.setItem('token', session.token);
		const { result } = renderHook(useSession);
		expect(result.current).toEqual(session);
	});

	it('should delete session on logout', async () => {
		const session = {
			email: 'the_email',
			token: 'the_token',
		};
		window.localStorage.setItem('email', session.email);
		window.localStorage.setItem('token', session.token);

		const { result } = renderHook(() => useSession());

		expect(result.current).toEqual(session);

		// eslint-disable-next-line @typescript-eslint/require-await
		await act(async () => {
			logout();
		});

		expect(window.localStorage.getItem('email')).toBeNull();
		expect(window.localStorage.getItem('token')).toBeNull();
	});
});
