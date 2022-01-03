import React, { FormEvent, useEffect, useState } from 'react';
import { getMe, useMe, useTimezones } from '../../lib/api';
import { Stack, TextField, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function GeneralSettings(): JSX.Element {
	const { updateMe, isUpdating } = useMe();
	const { data: timezones } = useTimezones();
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [timezone, setTimezone] = useState<string>('');

	useEffect(() => {
		getMe().then((me) => {
			const { name = '', email = '', timezone = '' } = me || {};

			setName(name);
			setEmail(email);
			setTimezone(timezone);
		});
	}, []);

	const prepareValue = (value: string) => {
		return value === '' ? undefined : value;
	};

	const saveGeneral = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		updateMe({
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

				<LoadingButton type={'submit'} loading={isUpdating}>
					Save
				</LoadingButton>
			</Stack>
		</form>
	);
}
