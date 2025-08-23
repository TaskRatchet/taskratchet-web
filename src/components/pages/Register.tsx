import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useCheckoutSession } from '../../lib/api/useCheckoutSession';
import { redirectToCheckout } from '../../lib/stripe';

function Register(): JSX.Element {
	const checkoutSession = useCheckoutSession();
	const isCheckoutLoading = checkoutSession === null;

	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!checkoutSession) {
			console.error('Registration form submitted without required data:', {
				checkoutSession: !!checkoutSession,
			});
			return;
		}

		redirectToCheckout(checkoutSession.id).catch((error) => {
			console.error('Failed to redirect to checkout:', error);
			// Consider showing user-friendly error message
		});
	};

	return (
		<Box sx={{ p: 2 }}>
			<form onSubmit={submit}>
				<Stack spacing={2} alignItems={'start'}>
					<h1>Complete Registration</h1>

					<p>Please add a payment method to complete your registration.</p>

					<LoadingButton
						type={'submit'}
						disabled={isCheckoutLoading}
						variant="outlined"
					>
						Add Payment Method
					</LoadingButton>
				</Stack>
			</form>
		</Box>
	);
}

export default Register;
