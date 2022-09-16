import apiFetch from './fetch1';

export default function register(
	name: string,
	email: string,
	password: string,
	timezone: string,
	checkoutSessionId: string | null
): Promise<Response> {
	return apiFetch('account/register', false, 'POST', {
		name: name,
		email: email,
		password: password,
		timezone: timezone,
		checkout_session_id: checkoutSessionId,
	});
}
