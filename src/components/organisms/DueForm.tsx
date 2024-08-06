import React, { useMemo } from 'react';
import formatDue from '../../lib/formatDue';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

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
		return dayjs(due);
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
						d.setHours(dueDate?.hour(), dueDate?.minute());
					}

					onChange({ due: formatDue(d) });
				}}
				slotProps={{
					openPickerButton: {
						'aria-label': 'change date',
					},
					textField: {
						required: true,
						InputLabelProps: {
							'aria-label': 'due date',
						},
						variant: 'standard',
					},
				}}
				disablePast
				maxDate={maxDue && dayjs(maxDue)}
				minDate={minDue && dayjs(minDue)}
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
						d.setFullYear(dueDate.year(), dueDate.month(), dueDate.date());
					onChange({ due: formatDue(d) });
				}}
				slotProps={{
					openPickerButton: {
						'aria-label': 'change time',
					},
					textField: {
						required: true,
						variant: 'standard',
					},
				}}
			/>
		</LocalizationProvider>
	);
}
