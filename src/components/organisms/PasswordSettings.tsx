import { LoadingButton } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
import { type FormEvent, useState } from 'react';

import { useUpdatePassword } from '../../lib/api/useUpdatePassword';

export default function PasswordSettings(): JSX.Element {
	const [oldPassword, setOldPassword] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [password2, setPassword2] = useState<string>('');
	const [shouldShowMismatch, setShouldShowMismatch] = useState<boolean>(false);
	const { updatePassword, isLoading } = useUpdatePassword();
	const mismatch = password !== password2;

	const savePassword = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!isPasswordFormValid()) return;

		updatePassword(oldPassword, password);
	};

	const isPasswordFormValid = () => {
		setShouldShowMismatch(true);
		return password === password2;
	};

	return (
		<form onSubmit={savePassword}>
			<Stack spacing={2} alignItems={'start'}>
				<TextField
					label={'Old Password'}
					onChange={(e) => setOldPassword(e.target.value)}
					value={oldPassword}
					type={'password'}
					required
				/>

				<TextField
					label={'New Password'}
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					type={'password'}
					required
					error={shouldShowMismatch && mismatch}
				/>

				<TextField
					label={'Retype Password'}
					onChange={(e) => setPassword2(e.target.value)}
					value={password2}
					type={'password'}
					required
					error={shouldShowMismatch && mismatch}
					helperText={shouldShowMismatch && mismatch && "Passwords don't match"}
				/>

				<LoadingButton loading={isLoading} type={'submit'} variant="outlined">
					Save
				</LoadingButton>
			</Stack>
		</form>
	);
}
