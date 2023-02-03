import React, { FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { resetPassword } from '../../lib/api/resetPassword';
import useDocumentTitle from '../../lib/useDocumentTitle';

function ResetPassword(): JSX.Element {
	const useToken = () => {
		const query = new URLSearchParams(useLocation().search);

		return query.get('t') || '';
	};

	const [messages, setMessages] = useState<string[]>([]);
	const [password, setPassword] = useState<string>('');
	const [password2, setPassword2] = useState<string>('');
	const token = useToken();

	useDocumentTitle('Reset Password | TaskRatchet');

	const submitForm = (event: FormEvent) => {
		event.preventDefault();

		clearMessages();

		if (!validateForm()) return;

		void resetPassword(token, password).then((res: Response) => {
			if (res.ok) {
				pushMessage('Password reset successfully');
			} else {
				pushMessage('Password reset failed');
				void res.text().then((t: string) => console.log(t));
			}
		});
	};

	const pushMessage = (msg: string) => {
		setMessages([...messages, msg]);
	};

	const clearMessages = () => {
		setMessages([]);
	};

	const validateForm = () => {
		let passes = true;

		if (!password || !password2) {
			pushMessage('Please enter new password twice');
			passes = false;
		}

		if (password !== password2) {
			pushMessage("Passwords don't match");
			passes = false;
		}

		return passes;
	};

	// TODO: Use MUI Input, Alert, Button, and Stack components
	return (
		<Box sx={{ p: 2 }}>
			<form onSubmit={submitForm}>
				<h1>Reset Password</h1>

				{messages.map((msg, i) => (
					<p key={i}>{msg}</p>
				))}

				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					name={'password'}
					placeholder={'Password'}
				/>
				<br />

				<input
					type="password"
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
					name={'password2'}
					placeholder={'Retype Password'}
				/>
				<br />

				<input type="submit" value={'Save new password'} />
			</form>
		</Box>
	);
}

export default ResetPassword;
