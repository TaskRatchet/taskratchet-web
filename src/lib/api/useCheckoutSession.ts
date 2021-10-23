import { getCheckoutSession } from './getCheckoutSession';
import { useEffect, useState } from 'react';

interface CheckoutSession {
	id: string;
}

export function useCheckoutSession() {
	const [checkoutSession, setCheckoutSession] =
		useState<CheckoutSession | null>(null);

	useEffect(() => {
		getCheckoutSession().then((session: CheckoutSession) => {
			setCheckoutSession(session);
		});
	}, []);

	return checkoutSession;
}
