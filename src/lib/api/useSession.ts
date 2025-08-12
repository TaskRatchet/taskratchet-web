import { useEffect, useState } from 'react';
import {
	type Session,
	getSession,
	subscribeToSession,
	unsubscribeFromSession,
} from '@taskratchet/sdk';

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
