import React, { useMemo } from 'react';
import { TextField } from '@mui/material';
import formatDue from '../../lib/formatDue';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type DueFormProps = {
	due: string;
	maxDue?: Date;
	minDue?: Date;
	onChange: (due: Record<string, string>) => void;
};

function isDayjsObject(value: unknown): value is { $d: Date } {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const d = (value as { $d?: unknown }).$d;
	// WORKAROUND: https://stackoverflow.com/a/643827/937377
	const isDate = Object.prototype.toString.call(d) === '[object Date]';

	return isDate;
}

export default function DueForm(props: DueFormProps): JSX.Element {
	const { due, minDue, maxDue, onChange } = props;
	const dueDate = useMemo(() => {
		return new Date(due);
	}, [due]);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				label="Due Date"
				value={dueDate}
				onChange={(value: unknown) => {
					if (!isDayjsObject(value)) return;

					const d = value.$d;

					if (isNaN(d.getTime())) return;

					if (due) {
						d.setHours(dueDate?.getHours(), dueDate?.getMinutes());
					}

					onChange({ due: formatDue(d) });
				}}
				OpenPickerButtonProps={{
					'aria-label': 'change date',
				}}
				disablePast
				renderInput={(params) => (
					<TextField
						required
						InputLabelProps={{
							'aria-label': 'due date',
						}}
						variant="standard"
						{...params}
					/>
				)}
				maxDate={maxDue}
				minDate={minDue}
			/>
			<TimePicker
				label="Due Time"
				value={dueDate}
				onChange={(value: unknown) => {
					if (!isDayjsObject(value)) {
						return;
					}

					const d = value.$d;

					if (isNaN(d.getTime())) return;
					if (due)
						d.setFullYear(
							dueDate.getFullYear(),
							dueDate.getMonth(),
							dueDate.getDate(),
						);
					onChange({ due: formatDue(d) });
				}}
				OpenPickerButtonProps={{
					'aria-label': 'change time',
				}}
				renderInput={(params) => (
					<TextField required variant="standard" {...params} />
				)}
			/>
		</LocalizationProvider>
	);
}
