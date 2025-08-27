import { type CheckoutSession, getCheckoutSession } from '@taskratchet/sdk';
import { useEffect, useState } from 'react';

import { STRIPE_CANCEL_URL, STRIPE_SUCCESS_URL } from '../../constants';

export function useCheckoutSession(): CheckoutSession | null {
	const [checkoutSession, setCheckoutSession] =
		useState<CheckoutSession | null>(null);

	useEffect(() => {
		void getCheckoutSession({
			success_url: STRIPE_SUCCESS_URL,
			cancel_url: STRIPE_CANCEL_URL,
		}).then((session: CheckoutSession) => {
			setCheckoutSession(session);
		});
	}, []);

	return checkoutSession;
}
