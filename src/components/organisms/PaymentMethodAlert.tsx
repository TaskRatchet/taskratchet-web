import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle } from '@mui/material';

import { useCheckoutSession } from '../../lib/api/useCheckoutSession';
import { useMe } from '../../lib/api/useMe';
import { redirectToCheckout } from '../../lib/stripe';

export default function PaymentMethodAlert() {
	const me = useMe();
	const isMissingPaymentMethod = me.isFetched && !me.data?.has_stripe_customer;
	const checkoutSession = useCheckoutSession();
	const isCheckoutLoading = checkoutSession === null;

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
			<Alert variant="outlined" severity="warning">
				<AlertTitle>Missing Payment Method</AlertTitle>
				<p>You need to add a payment method to use this feature.</p>
				<LoadingButton
					component="button"
					onClick={onClick}
					disabled={isCheckoutLoading}
					variant="outlined"
				>
					Add Payment Method
				</LoadingButton>
			</Alert>
		);
	}

	return null;
}
