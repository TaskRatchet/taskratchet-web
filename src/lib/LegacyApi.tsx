import { publishSession } from './api/useSession';
import { apiFetch } from './api';

// TODO: Migrate away from everything in this file
// TODO: Delete this file

export function login(email: string, password: string): Promise<boolean> {
	return apiFetch('account/login', false, 'POST', {
		email: email,
		password: password,
	}).then((res: Response) => {
		if (!res.ok) return false;

		void res.text().then((token: string) => _handleLoginResponse(email, token));

		return true;
	});
}

function _handleLoginResponse(email: string, token: string): void {
	window.localStorage.setItem('token', token);
	window.localStorage.setItem('email', email);

	publishSession();
}

export function requestResetEmail(email: string): Promise<Response> {
	return apiFetch('account/forgot-password', false, 'POST', { email: email });
}

export function resetPassword(
	token: string,
	password: string
): Promise<Response> {
	return apiFetch('account/reset-password', false, 'POST', {
		token: token,
		password: password,
	});
}
