import React, { FormEvent, useEffect } from 'react';
import './TaskForm.css';
import browser from '../../lib/Browser';
import {
	Alert,
	Box,
	Button,
	InputAdornment,
	Stack,
	TextField,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/lab';

interface TaskFormProps {
	task: string;
	due: Date | null;
	cents: number | null;
	timezone: string;
	error: string;
	onChange: (task: string, due: Date | null, cents: number | null) => void;
	onSubmit: () => void;
	actionLabel?: string;
	disableTaskField?: boolean;
	minCents?: number;
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
		minCents = 100,
	} = props;

	useEffect(() => {
		const getDefaultDue = () => {
			const due = browser.getNowDate();

			due.setDate(due.getDate() + 7);
			due.setHours(23);
			due.setMinutes(59);

			return due;
		};

		// TODO: Default to stakes of last-added task
		if (cents === null) {
			onChange(task, due, 500);
		}

		// TODO: Default to due offset of last-added task
		if (due === null) {
			onChange(task, getDefaultDue(), cents);
		}
	}, [task, due, cents, minCents, onChange]);

	return (
		<Box
			component={'form'}
			onSubmit={(e: FormEvent) => {
				e.preventDefault();
				onSubmit();
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
					value={cents && cents >= minCents ? cents / 100 : ''}
					onChange={(e) => {
						const cents = parseInt(e.target.value) * 100;
						onChange(task, due, cents >= minCents ? cents : 0);
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
						onChange(task, value, cents);
					}}
					OpenPickerButtonProps={{
						'aria-label': 'change time',
					}}
					renderInput={(params) => (
						<TextField required variant="standard" {...params} />
					)}
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

					<Button
						variant="contained"
						size={'small'}
						type="submit"
						color="primary"
					>
						{actionLabel}
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
};

export default TaskForm;
