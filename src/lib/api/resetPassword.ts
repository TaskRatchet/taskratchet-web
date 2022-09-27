import { apiFetch } from './apiFetch';

export function resetPassword(
	token: string,
	password: string
): Promise<Response> {
	return apiFetch('account/reset-password', false, 'POST', {
		token: token,
		password: password,
	});
}
