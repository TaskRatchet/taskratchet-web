import { logout, useSession } from './useSession';
import { act, renderHook } from '@testing-library/react';

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

	it('should delete session on logout', () => {
		const session = {
			email: 'the_email',
			token: 'the_token',
		};
		window.localStorage.setItem('email', session.email);
		window.localStorage.setItem('token', session.token);

		const { result } = renderHook(() => useSession());

		expect(result.current).toEqual(session);

		act(() => {
			logout();
		});

		expect(window.localStorage.getItem('email')).toBeNull();
		expect(window.localStorage.getItem('token')).toBeNull();
	});
});
