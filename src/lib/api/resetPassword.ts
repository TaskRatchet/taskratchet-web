import { fetch1 } from './fetch1';

export function resetPassword(
	token: string,
	password: string
): Promise<Response> {
	return fetch1('account/reset-password', false, 'POST', {
		token: token,
		password: password,
	});
}
