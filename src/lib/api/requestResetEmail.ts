import logEvent from '../logEvent';
import fetch1 from './fetch1';
import { EventCategory, EventAction } from '../logEvent';

export async function requestResetEmail(email: string): Promise<Response> {
	const result = await fetch1('account/forgot-password', false, 'POST', {
		email: email,
	});

	if (result.ok) {
		logEvent({
			category: EventCategory.Authentication,
			action: EventAction.PasswordResetRequest,
		});
	}

	return result;
}
