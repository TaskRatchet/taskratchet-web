import { LoadingButton } from '@mui/lab';
import { Alert, Button } from '@mui/material';
import { getCheckoutSession, updateMe } from '@taskratchet/sdk';
import { useCallback, useState } from 'react';

import { useMe } from '../../lib/api/useMe';
import { redirectToCheckout } from '../../lib/stripe';

export default function PaymentSettings(): JSX.Element {
	const me = useMe();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const handleAdd = useCallback(async () => {
		try {
			setLoading(true);
			const { id } = await getCheckoutSession();
			await updateMe({
				checkout_session_id: id,
			});
			await redirectToCheckout(id);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setError('Failed to add payment method');
			console.error(error);
		}
	}, []);

	return (
		<>
			{error && <Alert severity="error">{error}</Alert>}
			{me.data?.has_stripe_customer ? (
				<Button
					href="https://billing.stripe.com/p/login/00g4h79epeQigUw5kk"
					target="_blank"
					rel="noreferrer"
					variant="outlined"
				>
					Manage with Stripe
				</Button>
			) : (
				<LoadingButton
					loading={loading}
					variant="outlined"
					onClick={() => void handleAdd()}
				>
					Add payment method
				</LoadingButton>
			)}
		</>
	);
}
