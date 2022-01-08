import React, { useEffect, useState } from 'react';
import { useCheckoutSession, useMe } from '../../lib/api';
import { LoadingButton } from '@mui/lab';
import {
	Alert,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import useUpdateMe from '../../lib/api/useUpdateMe';

export default function PaymentSettings(): JSX.Element {
	const checkoutSession = useCheckoutSession();
	const me = useMe();
	const updateMe = useUpdateMe();
	const [cards, setCards] = useState<Card[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	useEffect(() => {
		error && setIsLoading(false);
	}, [error]);

	useEffect(() => {
		const { cards = [] } = me.data || {};
		setCards(cards);
	}, [me.data]);

	const updatePaymentDetails = async () => {
		setIsLoading(true);
		const sessionId = await getSessionId();

		if (sessionId === null) {
			setError('Checkout session error');
			return;
		}

		await updateMe.mutate({
			checkout_session_id: sessionId,
		});

		await redirect();
	};

	const redirect = async () => {
		await checkoutSession;

		if (checkoutSession == null) return;

		const stripe = window.Stripe(window.stripe_key);

		stripe
			.redirectToCheckout({
				sessionId: await getSessionId(),
			})
			.then((result: { error: { message: string } }) => {
				// If `redirectToCheckout` fails due to a browser or network
				// error, display the localized error message to your customer
				// using `result.error.message`.
				setError(result.error.message);
			});
	};

	const getSessionId = async () => {
		if (checkoutSession == null) return;

		const { id = null } = await checkoutSession;

		return id;
	};

	return (
		<>
			{error && <Alert severity="error">{error}</Alert>}

			<p>Saved payment method:</p>

			{cards ? (
				<List dense>
					{cards.map((c, i) => (
						<ListItem key={i} disableGutters>
							<ListItemIcon>
								<CreditCardIcon />
							</ListItemIcon>
							<ListItemText>
								{c.brand} ending with {c.last4}
							</ListItemText>
						</ListItem>
					))}
				</List>
			) : (
				<p>None</p>
			)}

			<LoadingButton loading={isLoading} onClick={updatePaymentDetails}>
				Replace payment method
			</LoadingButton>
		</>
	);
}
