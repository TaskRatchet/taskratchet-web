import { publishSession } from './useSession';
import fetch1 from './fetch1';
import logEvent from '../logEvent';
import { EventCategory, EventAction } from '../logEvent';

export async function login(email: string, password: string): Promise<boolean> {
	const res = await fetch1('account/login', false, 'POST', {
		email: email,
		password: password,
	});

	if (!res.ok) return false;

	const token = await res.text();

	window.localStorage.setItem('token', token);
	window.localStorage.setItem('email', email);

	publishSession();

	logEvent({
		category: EventCategory.Authentication,
		action: EventAction.Login,
	});

	return true;
}
