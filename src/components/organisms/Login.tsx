import React, { useState } from 'react';
import { useSession } from '../../lib/api/useSession';
import { Stack, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from 'react-query';
import { login } from '../../lib/api/login';
import { requestResetEmail } from '../../lib/api/requestResetEmail';

const api = {
	login,
	requestResetEmail,
};

const Login = (): JSX.Element => {
	const session = useSession();
	const login = useMutation(
		() => {
			setMessage('');
			return api.login(email, password);
		},
		{
			onError: () => {
				setMessage('Login failed');
			},
		}
	);
	const reset = useMutation(
		() => {
			setMessage('');
			return api.requestResetEmail(email);
		},
		{
			onError: () => {
				setMessage('Reset failed');
			},
			onSuccess: () => {
				setMessage(`Instructions sent to ${email}`);
			},
		}
	);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	return (
		<div>
			{session ? (
				<p>You are logged in as {session.email}</p>
			) : (
				<form>
					<Stack spacing={2} alignItems={'start'}>
						{message ? (
							<Alert severity="info" variant="filled">
								{message}
							</Alert>
						) : (
							''
						)}

						<TextField
							id={'email'}
							type={'email'}
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setEmailError('');
							}}
							label={'Email'}
							error={!!emailError}
							helperText={emailError}
						/>

						<TextField
							id={'password'}
							type={'password'}
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setPasswordError('');
							}}
							label={'Password'}
							error={!!passwordError}
							helperText={passwordError}
						/>

						<Stack direction={'row'} spacing={2}>
							<LoadingButton
								type="submit"
								variant="contained"
								onClick={(e) => {
									e.preventDefault();
									if (email && password) {
										login.mutate();
									} else {
										setEmailError(email ? '' : 'Email is required');
										setPasswordError(password ? '' : 'Password is required');
									}
								}}
								loading={login.isLoading}
								disabled={login.isLoading || reset.isLoading}
							>
								Submit
							</LoadingButton>
							<LoadingButton
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									if (email) {
										reset.mutate();
									} else {
										setEmailError(email ? '' : 'Email is required');
									}
								}}
								loading={reset.isLoading}
								disabled={login.isLoading || reset.isLoading}
							>
								Reset Password
							</LoadingButton>
						</Stack>
					</Stack>
				</form>
			)}
		</div>
	);
};

export default Login;
