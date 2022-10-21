import logEvent from '../logEvent';
import fetch1 from './fetch1';
import { EventCategory, EventAction } from '../logEvent';

export async function updatePassword(
	oldPassword: string,
	newPassword: string
): Promise<Response> {
	const result = await fetch1('me', true, 'PUT', {
		old_password: oldPassword,
		new_password: newPassword,
	});

	logEvent({
		category: EventCategory.Authentication,
		action: EventAction.PasswordUpdate,
	});

	return result;
}
