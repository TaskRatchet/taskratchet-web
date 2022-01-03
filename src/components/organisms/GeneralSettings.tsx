import React, { FormEvent, useEffect, useState } from 'react';
import { useMe, useTimezones } from '../../lib/api';

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
	);
}
