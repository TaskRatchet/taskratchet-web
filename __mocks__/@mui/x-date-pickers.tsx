import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';

dayjs.extend(customParseFormat);

function makePicker(format: string) {
	return function MockPicker(p: any) {
		const [value, setValue] = React.useState(p.value.format(format));
		return (
			<TextField
				{...{
					label: p.label,
					value,
					onChange: (e: any) => {
						setValue(e.target.value);
						p.onChange(dayjs(e.target.value, format));
					},
					...p.slotProps.textField,
				}}
			/>
		);
	};
}

const DatePicker = makePicker('MM/DD/YYYY');
const TimePicker = makePicker('hh:mm A');

export { DatePicker, TimePicker };
