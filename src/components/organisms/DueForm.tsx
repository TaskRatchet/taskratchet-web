import React, { useMemo, Suspense } from 'react';
import { TextField } from '@mui/material';
// import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import formatDue from '../../lib/formatDue';

const DatePicker = React.lazy(() =>
	import('@mui/x-date-pickers').then(({ DatePicker }) => ({
		default: DatePicker,
	}))
);
const TimePicker = React.lazy(() =>
	import('@mui/x-date-pickers').then(({ TimePicker }) => ({
		default: TimePicker,
	}))
);

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
		<Suspense fallback="loading">
			<DatePicker
				label="Due Date"
				value={dueDate}
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
				maxDate={maxDue}
				minDate={minDue}
			/>
			<TimePicker
				label="Due Time"
				value={dueDate}
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
		</Suspense>
	);
}
