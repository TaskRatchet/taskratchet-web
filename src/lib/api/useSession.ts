import { useEffect, useState } from 'react';
import logEvent from '../logEvent';
import { EventCategory, EventAction } from '../logEvent';

// TODO: Add proper type
let sessionSubs: Array<CallableFunction> = [];

function getSession(): Session | undefined {
	const email = window.localStorage.getItem('email');
	const token = window.localStorage.getItem('token');
	if (email && token) {
		return { email, token };
	}
}

function subscribeToSession(callback: CallableFunction): void {
	sessionSubs.push(callback);
}

function unsubscribeFromSession(callback: CallableFunction): void {
	sessionSubs = sessionSubs.filter((x: CallableFunction) => x !== callback);
}

// TODO: Should this function be in separate file?
export function publishSession(): void {
	const session: Session | undefined = getSession();

	sessionSubs.forEach((x: CallableFunction) => {
		x(session);
	});
}

// TODO: Should this function be in separate file?
export function logout(): void {
	logEvent({
		category: EventCategory.Authentication,
		action: EventAction.Logout,
	});

	window.localStorage.removeItem('email');
	window.localStorage.removeItem('token');

	// TODO: remove firebase_token, too

	publishSession();
}

export function useSession(): Session | undefined {
	const [session, setSession] = useState<Session | undefined>(getSession);

	useEffect(() => {
		function handleUpdate(session: Session) {
			setSession(session);
		}

		subscribeToSession(handleUpdate);

		return () => unsubscribeFromSession(handleUpdate);
	}, []);

	return session;
}
