import React, { useEffect, useState } from 'react';
import toaster from '../../lib/Toaster';
import { useCheckoutSession, useMe } from '../../lib/api';
import { LoadingButton } from '@mui/lab';
import {
	Card,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function PaymentSettings(): JSX.Element {
	const checkoutSession = useCheckoutSession(),
		{ me, updateMe } = useMe(),
		[cards, setCards] = useState<Card[]>([]);

	useEffect(() => {
		const { cards = [] } = me || {};
		setCards(cards);
	}, [me]);

	const updatePaymentDetails = async () => {
		const sessionId = await getSessionId();

		if (sessionId === null) {
			toaster.send('Checkout session error');
			return;
		}

		await updateMe({
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
				toaster.send(result.error.message);

				console.log('Checkout redirect error');
				console.log(result);
			});
	};

	const getSessionId = async () => {
		if (checkoutSession == null) return;

		const { id = null } = await checkoutSession;

		return id;
	};

	return (
		<>
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

			<LoadingButton onClick={updatePaymentDetails}>
				Replace payment method
			</LoadingButton>
		</>
	);
}
