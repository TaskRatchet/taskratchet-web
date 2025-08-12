import { type CheckoutSession, getCheckoutSession } from '@taskratchet/sdk';
import { useEffect, useState } from 'react';

export function useCheckoutSession(): CheckoutSession | null {
	const [checkoutSession, setCheckoutSession] =
		useState<CheckoutSession | null>(null);

	useEffect(() => {
		void getCheckoutSession().then((session: CheckoutSession) => {
			setCheckoutSession(session);
		});
	}, []);

	return checkoutSession;
}
