import React, { FormEvent, useEffect, useState } from 'react';
import { useMe, useTimezones } from '../../lib/api';
import { Button, Stack, TextField, Autocomplete } from '@mui/material';

export default function GeneralSettings(): JSX.Element {
	const { me, updateMe } = useMe(),
		{ data: timezones } = useTimezones(),
		[name, setName] = useState<string>(''),
		[email, setEmail] = useState<string>(''),
		[timezone, setTimezone] = useState<string>('');

	useEffect(() => {
		const { name = '', email = '', timezone = '' } = me || {};

		setName(name);
		setEmail(email);
		setTimezone(timezone);
	}, [me]);

	const prepareValue = (value: string) => {
		return value === '' ? undefined : value;
	};

	const saveGeneral = (event: FormEvent<HTMLFormElement>) => {
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

				<Button type={'submit'}>Save</Button>
			</Stack>
		</form>
	);
}
