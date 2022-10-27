import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useCheckoutSession } from '../../lib/api/useCheckoutSession';
import { useTimezones } from '../../lib/api/useTimezones';
import Input from '../molecules/Input';
import Field from '../molecules/Field';
import { Box, Button } from '@mui/material';
import register from '../../lib/api/register';
import { redirectToCheckout } from '../../lib/stripe';

const Register = (): JSX.Element => {
	const [name, setName] = useState<string>(''),
		[email, setEmail] = useState<string>(''),
		[password, setPassword] = useState<string>(''),
		[password2, setPassword2] = useState<string>(''),
		{ data: timezones } = useTimezones(),
		checkoutSession = useCheckoutSession(),
		[timezone, setTimezone] = useState<string>(''),
		[agreed, setAgreed] = useState<boolean>(false);

	const submit = async (event: FormEvent) => {
		event.preventDefault();

		const passes = validateRegistrationForm();

		if (!passes || !checkoutSession) return;

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
		let passes = true;

		if (!email) {
			toast('Email missing');
			passes = false;
		}

		if (!password || !password2) {
			toast('Please enter password twice');
			passes = false;
		}

		if (password !== password2) {
			toast("Passwords don't match");
			passes = false;
		}

		if (!agreed) {
			toast('Please agree before submitting');
			passes = false;
		}

		return passes;
	};

	const getTimezoneOptions = () => {
		if (!timezones)
			return (
				<option value={''} disabled>
					Loading...
				</option>
			);

		return (
			<>
				{
					<option value={''} disabled>
						Choose your timezone...
					</option>
				}
				{timezones.map((tz: string, i: number) => (
					<option value={tz} key={i}>
						{tz}
					</option>
				))}
			</>
		);
	};

	return (
		<Box sx={{ p: 2 }}>
			<form>
				<h1>Register</h1>

				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					label={'Name'}
					id={'name'}
				/>

				<Input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					id={'email'}
					label={'Email'}
				/>

				<Input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					id={'password'}
					label={'Password'}
				/>

				<Input
					type="password"
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
					id={'password2'}
					label={'Retype Password'}
				/>

				<Field label={'Timezone'} id={'timezone'}>
					<select
						id="timezone"
						name="timezone"
						value={timezone}
						onChange={(e) => setTimezone(e.target.value)}
					>
						{getTimezoneOptions()}
					</select>
				</Field>

				<p>
					<label>
						<input
							type="checkbox"
							value={'yes'}
							onChange={(e) => {
								setAgreed(e.target.value === 'yes');
							}}
						/>
						&nbsp;I have read and agree to TaskRatchet&apos;s{' '}
						<a
							href="https://taskratchet.com/privacy/"
							target={'_blank'}
							rel={'noopener noreferrer'}
						>
							privacy policy
						</a>{' '}
						and{' '}
						<a
							href="https://taskratchet.com/terms/"
							target={'_blank'}
							rel={'noopener noreferrer'}
						>
							terms of service
						</a>
						.
					</label>
				</p>

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
