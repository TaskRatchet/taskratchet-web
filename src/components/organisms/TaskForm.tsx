import React, { useState } from 'react';
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
import DueForm from './DueForm';
import { LoadingButton } from '@mui/lab';
import { SetOptional } from 'type-fest';

export type TaskFormProps = {
	task: string;
	due?: string;
	cents: number;
	recurrence?: Record<string, number>;
	timezone: string;
	error: string;
	onChange: (input: Partial<TaskInput>) => void;
	onSubmit: (input: SetOptional<TaskInput, 'due'>) => void;
	actionLabel?: string;
	disableTaskField?: boolean;
	minCents?: number;
	maxDue?: Date;
	minDue?: Date;
	isLoading: boolean;
};

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
	console.log(due);
	return (
		<Box component={'form'} className={'organism-taskForm'}>
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
				{due ? (
					<DueForm
						due={due}
						onChange={onChange}
						minDue={minDue}
						maxDue={maxDue}
					/>
				) : (
					''
				)}
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
						label="Interval in days"
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
						color="primary"
						onClick={() => onSubmit({ task, due, cents, recurrence })}
					>
						{actionLabel}
					</LoadingButton>
				</Stack>
			</Stack>
		</Box>
	);
};

export default TaskForm;
