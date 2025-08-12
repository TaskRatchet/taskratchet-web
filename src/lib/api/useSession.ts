import {
	getSession,
	type Session,
	subscribeToSession,
	unsubscribeFromSession,
} from '@taskratchet/sdk';
import { useEffect, useState } from 'react';

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
