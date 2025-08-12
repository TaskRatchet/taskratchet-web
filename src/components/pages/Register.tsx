import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

import { useCheckoutSession } from '../../lib/api/useCheckoutSession';
import { useTimezones } from '../../lib/api/useTimezones';
import useUpdateMe from '../../lib/api/useUpdateMe';
import { redirectToCheckout } from '../../lib/stripe';

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === 'string') {
		return error;
	}
	if (error && typeof error === 'object' && 'message' in error) {
		return (error as { message: string }).message;
	}
	return 'An unknown error occurred';
}

function Register(): JSX.Element {
	const updateMe = useUpdateMe();
	const { data: timezones } = useTimezones();
	const [timezone, setTimezone] = useState<string>('');
	const checkoutSession = useCheckoutSession();

	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!timezone || !checkoutSession) {
			console.error('Registration form submitted without required data:', {
				timezone: !!timezone,
				checkoutSession: !!checkoutSession,
			});
			return; // Early return instead of throwing
		}

		updateMe.mutate(
			{
				timezone,
				checkout_session_id: checkoutSession.id,
			},
			{
				onSuccess: () => {
					void redirectToCheckout(checkoutSession.id);
				},
			},
		);
	};

	return (
		<Box sx={{ p: 2 }}>
			<form onSubmit={submit}>
				<Stack spacing={2} alignItems={'start'}>
					<h1>Complete Registration</h1>

					<Autocomplete
						options={timezones || []}
						value={timezone || null}
						onChange={(_e, v) => v && setTimezone(v)}
						sx={{ width: 300 }}
						renderInput={(p) => (
							<TextField {...p} label={'Timezone'} required />
						)}
					/>

					{updateMe.error ? (
						<Alert severity="error">{getErrorMessage(updateMe.error)}</Alert>
					) : (
						''
					)}

					<LoadingButton
						type={'submit'}
						loading={updateMe.isLoading}
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
