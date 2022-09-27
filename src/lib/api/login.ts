import { publishSession } from './useSession';
import fetch1 from './fetch1';

export function login(email: string, password: string): Promise<boolean> {
	return fetch1('account/login', false, 'POST', {
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
