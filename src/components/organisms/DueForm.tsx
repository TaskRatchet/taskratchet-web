import React, { useMemo } from 'react';
import formatDue from '../../lib/formatDue';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(customParseFormat);
dayjs.extend(objectSupport);

type DueFormProps = {
	due: string;
	maxDue?: Date;
	minDue?: Date;
	onChange: (due: Record<string, string>) => void;
};

export default function DueForm(props: DueFormProps): JSX.Element {
	const { due, minDue, maxDue, onChange } = props;

	const dueDate = useMemo(() => {
		const d = dayjs(due, 'M/D/YYYY, h:mm A');
		return d.isValid() ? d : null;
	}, [due]);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				label="Due Date"
				value={dueDate}
				onChange={(value: Dayjs | null) => {
					if (!value?.isValid()) return;

					const d = dayjs({
						year: value.year(),
						month: value.month(),
						date: value.date(),
						hour: dueDate?.hour(),
						minute: dueDate?.minute(),
					});

					onChange({ due: formatDue(d.toDate()) });
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
				onChange={(value: Dayjs | null) => {
					if (!value?.isValid()) return;

					const d = dayjs({
						year: dueDate?.year(),
						month: dueDate?.month(),
						date: dueDate?.date(),
						hour: value.hour(),
						minute: value.minute(),
					});

					onChange({ due: formatDue(d.toDate()) });
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
