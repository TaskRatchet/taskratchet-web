import { LoadingButton } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
import { getMe } from '@taskratchet/sdk';
import { type FormEvent, useEffect, useState } from 'react';

import useUpdateMe from '../../lib/api/useUpdateMe';

export default function GeneralSettings(): JSX.Element {
	const updateMe = useUpdateMe();
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');

	useEffect(() => {
		void getMe().then((me) => {
			const { name = '', email = '' } = me || {};

			setName(name);
			setEmail(email);
		});
	}, []);

	const prepareValue = (value: string) => {
		return value === '' ? undefined : value;
	};

	const saveGeneral = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		updateMe.mutate({
			name: prepareValue(name),
			email: prepareValue(email),
		});
	};

	return (
		<form onSubmit={saveGeneral}>
			<Stack spacing={2} alignItems={'start'}>
				<TextField
					label={'Name'}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<TextField
					label={'Email'}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type={'email'}
				/>

				<LoadingButton
					type={'submit'}
					loading={updateMe.isLoading}
					variant="outlined"
				>
					Save
				</LoadingButton>
			</Stack>
		</form>
	);
}
