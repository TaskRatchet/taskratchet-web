import React, { useEffect } from 'react';
import './TaskForm.css';
import browser from '../../lib/Browser';
import { Button, Grid, InputAdornment, TextField } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/lab';

interface TaskFormProps {
	task: string;
	due: Date | null;
	cents: number | null;
	timezone: string;
	error: string;
	onChange: (task: string, due: Date | null, cents: number | null) => void;
	onSubmit: () => void;
}

const TaskForm = (props: TaskFormProps): JSX.Element => {
	const { task, due, cents, timezone, error, onChange, onSubmit } = props;

	useEffect(() => {
		const getDefaultDue = () => {
			const due = browser.getNow();

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
	}, [task, due, cents, onChange]);

	const dollars = cents ? cents / 100 : 0;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}
			className={'organism-taskForm'}
		>
			<Grid container spacing={2}>
				{error ? (
					<Grid item xs={12}>
						{error}
					</Grid>
				) : null}

				<Grid item xs={9}>
					<TextField
						id="page-tasks__task"
						label="Task"
						required
						value={task}
						onChange={(e) => {
							onChange(e.target.value, due, cents);
						}}
						fullWidth
					/>
				</Grid>

				<Grid item xs={3}>
					<TextField
						id="page-tasks__dollars"
						label="Stakes"
						required
						type="number"
						value={dollars > 0 ? dollars : ''}
						onChange={(e) => {
							onChange(task, due, parseInt(e.target.value) * 100);
						}}
						fullWidth
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">$</InputAdornment>
							),
							endAdornment: <InputAdornment position="end">USD</InputAdornment>,
						}}
					/>
				</Grid>

				<Grid item xs={7}>
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
								fullWidth
								InputLabelProps={{
									'aria-label': 'due date',
								}}
								{...params}
							/>
						)}
					/>
				</Grid>

				<Grid item xs={5}>
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
						renderInput={(params) => <TextField required {...params} />}
					/>
				</Grid>

				<Grid item xs>
					<Button
						href={'https://docs.taskratchet.com/timezones.html'}
						target={'_blank'}
						rel={'noopener noreferrer'}
						size={'small'}
					>
						{timezone}
					</Button>
				</Grid>

				<Grid item xs={3}>
					<Button
						variant="contained"
						size={'small'}
						type="submit"
						color="primary"
					>
						Add
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

export default TaskForm;
