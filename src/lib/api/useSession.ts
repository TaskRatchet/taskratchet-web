import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// TODO: Add proper type
let sessionSubs: Array<CallableFunction> = [];

function getSession() {
	return cookies.get('tr_session');
}

function subscribeToSession(callback: CallableFunction) {
	sessionSubs.push(callback);
}

function unsubscribeFromSession(callback: CallableFunction) {
	sessionSubs = sessionSubs.filter((x: CallableFunction) => x !== callback);
}

// TODO: Should this function be in separate file?
export function publishSession() {
	const session = getSession();

	sessionSubs.forEach((x: CallableFunction) => x(session));
}

// TODO: Should this function be in separate file?
export function logout() {
	cookies.remove('tr_session');

	publishSession();
}

export function useSession() {
	const [session, setSession] = useState<Session>(getSession());

	useEffect(() => {
		function handleUpdate(session: Session) {
			setSession(session);
		}

		subscribeToSession(handleUpdate);

		return () => unsubscribeFromSession(handleUpdate);
	}, []);

	return session;
}
