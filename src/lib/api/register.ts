import { fetch1 } from './fetch1';

export default function register(
	name: string,
	email: string,
	password: string,
	timezone: string,
	checkoutSessionId: string | null
): Promise<Response> {
	return fetch1('account/register', false, 'POST', {
		name: name,
		email: email,
		password: password,
		timezone: timezone,
		checkout_session_id: checkoutSessionId,
	});
}
