import React, { FormEvent, useEffect, useState } from 'react';
import { getMe } from '../../lib/api/getMe';
import { useTimezones } from '../../lib/api/useTimezones';
import { Stack, TextField, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useUpdateMe from '../../lib/api/useUpdateMe';

export default function GeneralSettings(): JSX.Element {
	const updateMe = useUpdateMe();
	const { data: timezones } = useTimezones();
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [timezone, setTimezone] = useState<string>('');

	useEffect(() => {
		void getMe().then((me) => {
			const { name = '', email = '', timezone = '' } = me || {};

			setName(name);
			setEmail(email);
			setTimezone(timezone);
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
			timezone: prepareValue(timezone),
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

				<Autocomplete
					options={timezones || []}
					value={timezone || null}
					onChange={(e, v) => v && setTimezone(v)}
					sx={{ width: 300 }}
					renderInput={(p) => <TextField {...p} label={'Timezone'} />}
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
