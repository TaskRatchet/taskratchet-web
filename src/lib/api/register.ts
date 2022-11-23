import logEvent from '../logEvent';
import fetch1 from './fetch1';
import { EventCategory, EventAction } from '../logEvent';

export default async function register(
	name: string,
	email: string,
	password: string,
	timezone: string,
	checkoutSessionId: string | null
): Promise<Response> {
	const result = await fetch1('account/register', false, 'POST', {
		name: name,
		email: email,
		password: password,
		timezone: timezone,
		checkout_session_id: checkoutSessionId,
	});

	if (result.ok) {
		logEvent({
			category: EventCategory.Authentication,
			action: EventAction.Signup,
		});
	}

	return result;
}
