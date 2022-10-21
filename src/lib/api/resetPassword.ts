import logEvent from '../logEvent';
import fetch1 from './fetch1';
import { EventCategory, EventAction } from '../logEvent';

export async function resetPassword(
	token: string,
	password: string
): Promise<Response> {
	const result = await fetch1('account/reset-password', false, 'POST', {
		token: token,
		password: password,
	});

	if (result.ok) {
		logEvent({
			category: EventCategory.Authentication,
			action: EventAction.PasswordReset,
		});
	}

	return result;
}
