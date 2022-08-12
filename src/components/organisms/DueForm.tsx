import React, { useMemo } from 'react';
import { TextField } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/lab';
import formatDue from '../../lib/formatDue';

type DueFormProps = {
	due: string;
	maxDue?: Date;
	minDue?: Date;
	onChange: (due: Record<string, string>) => void;
};

export default function DueForm(props: DueFormProps): JSX.Element {
	const { due, minDue, maxDue, onChange } = props;
	const dueDate = useMemo(() => {
		return new Date(due);
	}, [due]);

	return (
		<>
			<DatePicker
				label="Due Date"
				clearable={false}
				value={due}
				onChange={(value: unknown) => {
					if (!(value instanceof Date)) return;
					if (isNaN(value.getTime())) return;
					if (due) {
						value.setHours(dueDate?.getHours(), dueDate?.getMinutes());
					}
					onChange({ due: formatDue(value) });
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
				maxDate={maxDue && new Date(maxDue)}
				minDate={minDue && new Date(minDue)}
			/>
			<TimePicker
				label="Due Time"
				clearable={false}
				value={due}
				onChange={(value: unknown) => {
					if (!(value instanceof Date)) return;
					if (isNaN(value.getTime())) return;
					if (due)
						value.setFullYear(
							dueDate.getFullYear(),
							dueDate.getMonth(),
							dueDate.getDate()
						);
					onChange({ due: formatDue(value) });
				}}
				OpenPickerButtonProps={{
					'aria-label': 'change time',
				}}
				renderInput={(params) => (
					<TextField required variant="standard" {...params} />
				)}
			/>
		</>
	);
}
