import { useClerk } from '@clerk/clerk-react';
import type { ListenerCallback } from '@clerk/types';
import { useEffect } from 'react';

export function useOnClerkEvent(callback: ListenerCallback) {
	const clerk = useClerk();

	useEffect(() => {
		if (!clerk) return;
		const unsubscribe = clerk.addListener(({ user, session, client }) => {
			callback({ user, session, client });
		});
		return unsubscribe;
	}, [clerk, callback]);
}
