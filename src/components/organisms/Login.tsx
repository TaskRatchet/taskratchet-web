import React from 'react';
import { useMachine } from '@xstate/react';
import createLoginMachine from './Login.machine';
import { useSession } from '../../lib/api/useSession';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const machine = createLoginMachine();

const Login = (): JSX.Element => {
	const [state, send] = useMachine(machine),
		session = useSession();

	const isLoading = () => {
		return state.matches('authenticating') || state.matches('resetting');
	};

	return (
		<div className={isLoading() ? 'loading' : ''}>
			{session ? (
				<p>You are logged in as {session.email}</p>
			) : (
				<form>
					<Stack spacing={2} alignItems={'start'}>
						{state.context.message ? (
							<div className={'organism-login__message alert info'}>
								{state.context.message}
							</div>
						) : (
							''
						)}

						<TextField
							id={'email'}
							type={'email'}
							value={state.context.email}
							onChange={(e) =>
								send({
									type: 'EMAIL',
									value: e.target.value,
								})
							}
							label={'Email'}
							error={!!state.context.emailError}
							helperText={state.context.emailError}
						/>

						<TextField
							id={'password'}
							type={'password'}
							value={state.context.password}
							onChange={(e) =>
								send({
									type: 'PASSWORD',
									value: e.target.value,
								})
							}
							label={'Password'}
							error={!!state.context.passwordError}
							helperText={state.context.passwordError}
						/>

						<Stack direction={'row'}>
							<LoadingButton
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									send('LOGIN');
								}}
							>
								Submit
							</LoadingButton>
							<LoadingButton
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									send('RESET');
								}}
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
