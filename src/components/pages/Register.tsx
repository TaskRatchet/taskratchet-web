import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useCheckoutSession } from '../../lib/api/useCheckoutSession';
import { useTimezones } from '../../lib/api/useTimezones';
import { Box, Button, Link, Stack } from '@mui/material';
import register from '../../lib/api/register';
import { redirectToCheckout } from '../../lib/stripe';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import saveFeedback from '../../lib/saveFeedback';
import useDocumentTitle from '../../lib/useDocumentTitle';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Register = (): JSX.Element => {
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [password2, setPassword2] = useState<string>('');
	const { data: timezones } = useTimezones();
	const checkoutSession = useCheckoutSession();
	const [timezone, setTimezone] = useState<string>('');
	const [agreed, setAgreed] = useState<boolean>(false);
	const [referral, setReferral] = useState<string>('');
	const [showErrors, setShowErrors] = useState<boolean>(false);

	useDocumentTitle('Register | TaskRatchet');

	const submit = async (event: FormEvent) => {
		event.preventDefault();

		setShowErrors(true);

		const passes = validateRegistrationForm();

		if (!passes || !checkoutSession) return;

		if (referral) {
			saveFeedback({
				userName: name,
				userEmail: email,
				prompt: 'How did you hear about us?',
				response: referral,
			});
		}

		const response = await register(
			name,
			email,
			password,
			timezone,
			checkoutSession.id
		);

		if (response.ok) {
			toast('Redirecting...');
			redirectToCheckout(checkoutSession.id).catch((error: string) => {
				toast(error);
			});
		} else {
			toast('Registration failed');
		}
	};

	const validateRegistrationForm = () => {
		return email && password && password2 && password === password2 && agreed;
	};

	const getTimezoneOptions = () => {
		if (!timezones)
			return (
				<MenuItem value={''} disabled>
					Loading...
				</MenuItem>
			);

		return [
			<MenuItem value={''} key="default" disabled>
				Choose your timezone...
			</MenuItem>,
			...timezones.map((tz: string, i: number) => (
				<MenuItem value={tz} key={i}>
					{tz}
				</MenuItem>
			)),
		];
	};

	return (
		<Box sx={{ p: 2 }}>
			<form>
				<h1>Register</h1>
				<Stack spacing={2}>
					<TextField
						value={name}
						onChange={(e) => setName(e.target.value)}
						label={'Name'}
						id={'name'}
					/>

					<TextField
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						id={'email'}
						label={'Email'}
						required
						error={showErrors && !email}
						helperText={showErrors && !email && 'Email is required'}
					/>

					<TextField
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						id={'password'}
						label={'Password'}
						required
						error={showErrors && !password}
						helperText={showErrors && !password && 'Password is required'}
					/>

					<TextField
						type="password"
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
						id={'password2'}
						label={'Retype Password'}
						required
						error={showErrors && !password2}
						helperText={showErrors && !password2 && 'Password is required'}
					/>

					<FormControl required error={showErrors && !timezone}>
						<InputLabel id={'timezone'}>Timezone</InputLabel>
						<Select
							labelId={'timezone'}
							label={'Timezone'}
							id="timezone"
							name="timezone"
							value={timezone}
							onChange={(e) => setTimezone(e.target.value)}
						>
							{getTimezoneOptions()}
						</Select>
						{showErrors && !timezone && (
							<FormHelperText>Timezone is required</FormHelperText>
						)}
					</FormControl>

					<TextField
						value={referral}
						onChange={(e) => setReferral(e.target.value)}
						label={'How did you hear about us?'}
						id={'referral'}
					/>

					<FormControl required error={showErrors && !agreed}>
						<FormControlLabel
							control={
								<Checkbox
									value={agreed}
									onChange={(e) => setAgreed(e.target.checked)}
								/>
							}
							label={
								<>
									I have read and agree to TaskRatchet&apos;s{' '}
									<Link
										href="https://taskratchet.com/privacy.html"
										target={'_blank'}
										rel={'noopener noreferrer'}
									>
										privacy policy
									</Link>{' '}
									and{' '}
									<Link
										href="https://taskratchet.com/terms.html"
										target={'_blank'}
										rel={'noopener noreferrer'}
									>
										terms of service
									</Link>
									.
								</>
							}
						/>

						{showErrors && !agreed && (
							<FormHelperText>You must agree to the terms</FormHelperText>
						)}
					</FormControl>
				</Stack>

				<p>
					Press the button below to be redirected to our payments provider to
					add your payment method.
				</p>

				<Button
					disabled={checkoutSession == null}
					onClick={(e) => void submit(e)}
					variant={'contained'}
				>
					Add payment method
				</Button>
			</form>
		</Box>
	);
};

export default Register;
