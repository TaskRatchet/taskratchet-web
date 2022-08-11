import React, { FormEvent, useState } from 'react';
import {
	Alert,
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	InputAdornment,
	Stack,
	TextField,
} from '@mui/material';
import { DatePicker, LoadingButton, TimePicker } from '@mui/lab';

interface TaskFormProps {
	task: string;
	due: Date;
	cents: number;
	recurrence?: Record<string, number>;
	timezone: string;
	error: string;
	onChange: (input: TaskInput) => void;
	onSubmit: (input: TaskInput) => void;
	actionLabel?: string;
	disableTaskField?: boolean;
	minCents?: number;
	maxDue?: Date;
	minDue?: Date;
	isLoading: boolean;
}

const TaskForm = (props: TaskFormProps): JSX.Element => {
	const {
		task,
		due,
		cents,
		recurrence,
		timezone,
		error,
		onChange,
		onSubmit,
		actionLabel = 'Add',
		maxDue,
		minDue,
		minCents = 100,
		isLoading,
	} = props;
	const [recurrenceEnabled, setRecurrenceEnabled] = useState<boolean>(false);
	const [interval, setInterval] = useState<number>(1);

	return (
		<Box
			component={'form'}
			onSubmit={(e: FormEvent) => {
				e.preventDefault();
				onSubmit({ task, due, cents, recurrence });
			}}
			className={'organism-taskForm'}
		>
			<Stack spacing={2}>
				{error ? <Alert severity={'error'}>{error}</Alert> : null}

				<TextField
					id="page-tasks__task"
					label="Task"
					required
					value={task}
					onChange={(e) => {
						onChange({ task: e.target.value, due, cents, recurrence });
					}}
					fullWidth
					variant="standard"
					multiline
					disabled={props.disableTaskField}
				/>
				<TextField
					id="page-tasks__dollars"
					label="Stakes"
					required
					type="number"
					value={cents / 100}
					onChange={(e) => {
						const number = parseInt(e.target.value);
						onChange({
							task,
							due,
							cents: isNaN(number) ? 0 : number * 100,
							recurrence,
						});
					}}
					InputProps={{
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
						endAdornment: <InputAdornment position="end">USD</InputAdornment>,
						inputProps: { min: minCents / 100 },
					}}
					variant="standard"
				/>
				<DatePicker
					label="Due Date"
					clearable={false}
					value={due}
					onChange={(value: unknown) => {
						if (!(value instanceof Date)) return;
						if (isNaN(value.getTime())) return;
						if (due) value.setHours(due?.getHours(), due?.getMinutes());
						onChange({ task, due: value, cents, recurrence });
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
								due.getFullYear(),
								due.getMonth(),
								due.getDate()
							);
						onChange({ task, due: value, cents, recurrence });
					}}
					OpenPickerButtonProps={{
						'aria-label': 'change time',
					}}
					renderInput={(params) => (
						<TextField required variant="standard" {...params} />
					)}
				/>
				<FormControlLabel
					control={
						<Checkbox
							onChange={() => {
								setRecurrenceEnabled(!recurrenceEnabled);
								onChange({
									task,
									due,
									cents,
									recurrence: recurrenceEnabled
										? undefined
										: { days: interval },
								});
							}}
						/>
					}
					label="Enable recurrence"
				/>
				{recurrenceEnabled && (
					<TextField
						label="Interval"
						onChange={(e) => {
							const n = parseInt(e.target.value);
							onChange({ task, due, cents, recurrence: { days: n } });
							setInterval(n);
						}}
					/>
				)}

				<Stack direction={'row'} justifyContent={'space-between'}>
					<Button
						href={'https://docs.taskratchet.com/timezones.html'}
						target={'_blank'}
						rel={'noopener noreferrer'}
						size={'small'}
					>
						{timezone}
					</Button>

					<LoadingButton
						loading={isLoading}
						variant="contained"
						size={'small'}
						type="submit"
						color="primary"
					>
						{actionLabel}
					</LoadingButton>
				</Stack>
			</Stack>
		</Box>
	);
};

export default TaskForm;
