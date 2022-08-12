import { publishSession } from './api/useSession';
import { apiFetch } from './api';

// TODO: Migrate away from everything in this class
// TODO: Delete this file

export class LegacyApi {
	login(email: string, password: string): Promise<boolean> {
		return apiFetch('account/login', false, 'POST', {
			email: email,
			password: password,
		}).then((res: Response) => {
			if (!res.ok) return false;

			res
				.text()
				.then((token: string) => this._handleLoginResponse(email, token));

			return true;
		});
	}

	_handleLoginResponse(email: string, token: string): void {
		window.localStorage.setItem('token', token);
		window.localStorage.setItem('email', email);

		publishSession();
	}

	requestResetEmail(email: string): Promise<Response> {
		return apiFetch('account/forgot-password', false, 'POST', { email: email });
	}

	resetPassword(token: string, password: string): Promise<Response> {
		return apiFetch('account/reset-password', false, 'POST', {
			token: token,
			password: password,
		});
	}
}

const api = new LegacyApi();

export default api;
