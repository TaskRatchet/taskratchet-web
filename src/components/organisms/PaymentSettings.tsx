import React from 'react';
import { Button } from '@mui/material';

export default function PaymentSettings(): JSX.Element {
	return (
		<>
			<Button
				href="https://billing.stripe.com/p/login/00g4h79epeQigUw5kk"
				target="_blank"
				rel="noreferrer"
				variant="outlined"
			>
				Manage your payment details with Stripe
			</Button>
		</>
	);
}
