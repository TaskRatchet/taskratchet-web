import fetch1 from './fetch1';

export function requestResetEmail(email: string): Promise<Response> {
	return fetch1('account/forgot-password', false, 'POST', { email: email });
}
