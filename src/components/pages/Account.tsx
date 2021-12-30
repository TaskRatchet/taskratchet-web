import React, { FormEvent, useEffect, useState } from 'react';
import './Account.css';
import toaster from '../../lib/Toaster';
import Input from '../molecules/Input';
import BeeminderSettings from '../organisms/BeeminderSettings';
import { useCheckoutSession, useMe, useTimezones } from '../../lib/api';
import { useIsFetching } from 'react-query';
import { useUpdatePassword } from '../../lib/api/useUpdatePassword';

const Account = (): JSX.Element => {
	const isFetching = useIsFetching(),
		checkoutSession = useCheckoutSession(),
		{ data: timezones } = useTimezones(),
		{ me, updateMe } = useMe(),
		[name, setName] = useState<string>(''),
		[email, setEmail] = useState<string>(''),
		[timezone, setTimezone] = useState<string>(''),
		[cards, setCards] = useState<Card[]>([]),
		[oldPassword, setOldPassword] = useState<string>(''),
		[password, setPassword] = useState<string>(''),
		[password2, setPassword2] = useState<string>(''),
		{ updatePassword, isLoading } = useUpdatePassword();

	useEffect(() => {
		const { name = '', email = '', timezone = '', cards = [] } = me || {};

		setName(name);
		setEmail(email);
		setTimezone(timezone);
		setCards(cards);
	}, [me]);

	const saveGeneral = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		updateMe({
			name: prepareValue(name),
			email: prepareValue(email),
			timezone: prepareValue(timezone),
		});
	};

	const prepareValue = (value: string) => {
		return value === '' ? undefined : value;
	};

	const savePassword = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!isPasswordFormValid()) return;

		updatePassword(oldPassword, password);
	};

	// TODO: Print to form instead of toasting
	const isPasswordFormValid = () => {
		let passed = true;

		if (oldPassword === '') {
			toaster.send('Old password required');
			passed = false;
		}

		if (password === '') {
			toaster.send('New password required');
			passed = false;
		}

		if (password !== password2) {
			toaster.send("New password fields don't match");
			passed = false;
		}

		return passed;
	};

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
		<div
			className={`page-account ${isFetching || isLoading ? 'loading' : 'idle'}`}
		>
			<h1>Account</h1>

			<form onSubmit={saveGeneral}>
				<label htmlFor="name">Name</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					id={'name'}
					name={'name'}
				/>

				<label htmlFor="email">Email</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					id={'email'}
					name={'email'}
				/>

				<label htmlFor="timezone">Timezone</label>
				<select
					id={'timezone'}
					name="timezone"
					value={timezone}
					onChange={(e) => setTimezone(e.target.value)}
				>
					{timezones &&
						timezones.map((tz: string, i: number) => (
							<option value={tz} key={i}>
								{tz}
							</option>
						))}
				</select>

				<input type="submit" value={'Save'} />
			</form>

			<h2>Reset Password</h2>

			<form onSubmit={savePassword}>
				<Input
					id={'old_password'}
					label={'Old Password'}
					onChange={(e) => setOldPassword(e.target.value)}
					value={oldPassword}
					type={'password'}
				/>

				<Input
					id={'password'}
					label={'New Password'}
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					type={'password'}
				/>

				<Input
					id={'password2'}
					label={'Retype Password'}
					onChange={(e) => setPassword2(e.target.value)}
					value={password2}
					type={'password'}
				/>

				<input type="submit" value={'Save'} />
			</form>

			<h2>Update Payment Details</h2>

			<p>Saved payment method:</p>

			{cards ? (
				<ul>
					{cards.map((c, i) => (
						<li key={i}>
							{c.brand} ending with {c.last4}
						</li>
					))}
				</ul>
			) : (
				<p>None</p>
			)}

			<button onClick={updatePaymentDetails}>Replace payment method</button>

			<h2>Beeminder Integration</h2>

			<BeeminderSettings />
		</div>
	);
};

export default Account;
