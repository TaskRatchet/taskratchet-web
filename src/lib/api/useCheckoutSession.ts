import { useEffect, useState } from 'react';
import { CheckoutSession, getCheckoutSession } from '@taskratchet/sdk';

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
