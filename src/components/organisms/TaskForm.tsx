import React, { FormEvent } from 'react';
import {
	Alert,
	Box,
	Button,
	InputAdornment,
	Stack,
	TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

interface TaskFormProps {
	task: string;
	due: Date;
	cents: number;
	timezone: string;
	error: string;
	onChange: (task: string, due: Date, cents: number) => void;
	onSubmit: (task: string, due: Date, cents: number) => void;
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

	return (
		<Box
			component={'form'}
			onSubmit={(e: FormEvent) => {
				e.preventDefault();
				onSubmit(task, due, cents);
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
						onChange(e.target.value, due, cents);
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
						onChange(task, due, isNaN(number) ? 0 : number * 100);
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
					value={due}
					onChange={(value: unknown) => {
						if (!(value instanceof Date)) return;
						if (isNaN(value.getTime())) return;
						if (due) value.setHours(due?.getHours(), due?.getMinutes());
						onChange(task, value, cents);
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
						onChange(task, value, cents);
					}}
					OpenPickerButtonProps={{
						'aria-label': 'change time',
					}}
					renderInput={(params) => {
						return <TextField required variant="standard" {...params} />;
					}}
				/>

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
