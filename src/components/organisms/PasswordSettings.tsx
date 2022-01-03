import Input from '../molecules/Input';
import React, { FormEvent, useState } from 'react';
import toaster from '../../lib/Toaster';
import { useUpdatePassword } from '../../lib/api/useUpdatePassword';

export default function PasswordSettings(): JSX.Element {
	const [oldPassword, setOldPassword] = useState<string>(''),
		[password, setPassword] = useState<string>(''),
		[password2, setPassword2] = useState<string>(''),
		{ updatePassword } = useUpdatePassword();

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

	return (
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
	);
}
