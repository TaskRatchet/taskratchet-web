import { useState } from 'react';
import { Button } from '@mui/material';
import { useMe } from '../../lib/api/useMe';
import { redirectToCheckout } from '../../lib/stripe';
import { LoadingButton } from '@mui/lab';
import { getCheckoutSession, updateMe } from '@taskratchet/sdk';

export default function PaymentSettings(): JSX.Element {
	const me = useMe();
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<>
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
					onClick={() => {
						void (async () => {
							setLoading(true);
							const { id } = await getCheckoutSession();
							await updateMe({
								checkout_session_id: id,
							});
							await redirectToCheckout(id);
							setLoading(false);
						})();
					}}
				>
					Add payment method
				</LoadingButton>
			)}
		</>
	);
}
