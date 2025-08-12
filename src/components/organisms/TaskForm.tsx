import React, { Suspense } from 'react';
import {
	Alert,
	Box,
	Button,
	InputAdornment,
	Stack,
	TextField,
	Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import type { SetOptional } from 'type-fest';

const LazyDueForm = React.lazy(() => import('./DueForm'));

interface TaskFormProps {
	task: string;
	due?: number;
	cents: number;
	timezone: string;
	error: string;
	onChange: (updates: Partial<TaskInput>) => void;
	onCancel: () => void;
	onSubmit: (input: SetOptional<TaskInput, 'due'>) => void;
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
		onCancel,
		onSubmit,
		actionLabel = 'Add',
		maxDue,
		minDue,
		minCents = 100,
		isLoading,
	} = props;

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
						onChange({ task: e.target.value });
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
							cents: isNaN(number) ? 0 : number * 100,
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
					<Suspense fallback="loading">
						<LazyDueForm
							due={due}
							onChange={onChange}
							minDue={minDue}
							maxDue={maxDue}
						/>
					</Suspense>
				) : (
					''
				)}

				<Link
					href={'https://taskratchet.com/help/timezones.html'}
					target={'_blank'}
					rel={'noopener noreferrer'}
				>
					{timezone}
				</Link>

				<Stack direction={'row'} spacing={2} justifyContent="end">
					<Button onClick={onCancel} variant="outlined">
						Cancel
					</Button>

					<LoadingButton
						onClick={() =>
							onSubmit({
								task,
								cents,
								due,
							})
						}
						loading={isLoading}
						variant="contained"
						size={'small'}
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
