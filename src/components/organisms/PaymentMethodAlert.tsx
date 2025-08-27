import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, Typography } from '@mui/material';
import { getMe } from '@taskratchet/sdk';
import { useEffect, useState } from 'react';

import { useCheckoutSession } from '../../lib/api/useCheckoutSession';
import { redirectToCheckout } from '../../lib/stripe';

export default function PaymentMethodAlert() {
	const [isMissingPaymentMethod, setIsMissingPaymentMethod] =
		useState<boolean>(false);
	const checkoutSession = useCheckoutSession();
	const isCheckoutLoading = checkoutSession === null;

	useEffect(() => {
		getMe()
			.then((me) => {
				setIsMissingPaymentMethod(!me.has_stripe_customer);
			})
			.catch((e) => {
				console.error(e);
			});
	}, []);

	const onClick = () => {
		if (!checkoutSession) {
			console.error('Payment method setup failed without required data:', {
				checkoutSession: !!checkoutSession,
			});
			return;
		}

		redirectToCheckout(checkoutSession.id).catch((error) => {
			console.error('Failed to redirect to checkout:', error);
			// Consider showing user-friendly error message
		});
	};

	if (isMissingPaymentMethod) {
		return (
			<Alert variant="outlined" severity="warning" sx={{ m: 2 }}>
				<AlertTitle>Missing Payment Method</AlertTitle>
				<Typography>
					You need to add a payment method to use TaskRatchet.
				</Typography>
				<LoadingButton
					component="button"
					onClick={onClick}
					disabled={isCheckoutLoading}
					variant="outlined"
					sx={{ mt: 2 }}
				>
					Add Payment Method
				</LoadingButton>
			</Alert>
		);
	}

	return null;
}
