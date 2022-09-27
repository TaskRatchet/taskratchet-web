import { apiFetch } from './apiFetch';

export function requestResetEmail(email: string): Promise<Response> {
	return apiFetch('account/forgot-password', false, 'POST', { email: email });
}
