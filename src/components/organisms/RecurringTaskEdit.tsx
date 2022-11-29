import React, { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import TaskForm from './TaskForm';
import { useTimezone } from '../../lib/api/useTimezone';
import updateRecurringTask from '../../lib/api/updateRecurringTask';
import { Dialog, DialogContent, DialogTitle, MenuItem } from '@mui/material';

export default function RecurringTaskEdit({
	recurringTask,
	onOpen,
}: {
	recurringTask: RecurringTask;
	onOpen?: () => void;
}): JSX.Element {
	const timezone = useTimezone() || '';
	const [cents, setCents] = useState<number>(recurringTask.cents);
	const [task, setTask] = useState(recurringTask.task);
	const [error, setError] = useState<string>('');
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const update = useMutation(updateRecurringTask, {
		onSuccess: () => {
			setIsOpen(false);
		},
	});

	const errorMessage: string = useMemo(() => {
		if (update.error instanceof Error) {
			return update.error.message;
		}

		return error || '';
	}, [error, update]);

	const onChange = ({ task, cents }: Partial<RecurringTaskInput>) => {
		if (task !== undefined) setTask(task);
		cents && setCents(cents);
	};

	function onSubmit() {
		if (!task) {
			setError('Task is required');
			return;
		}

		if (!cents) {
			setError('Cents is required');
			return;
		}

		if (cents < 0) {
			setError('Cents must be greater than 0');
			return;
		}

		setError('');

		update.mutate({ ...recurringTask, task, cents });
	}

	return (
		<>
			<MenuItem
				onClick={() => {
					onOpen && onOpen();
					setIsOpen(true);
				}}
			>
				Edit
			</MenuItem>

			<Dialog onClose={() => setIsOpen(false)} open={isOpen}>
				<DialogTitle>Edit Task</DialogTitle>
				<DialogContent dividers>
					<TaskForm
						task={task}
						cents={cents}
						timezone={timezone}
						error={errorMessage}
						onChange={onChange}
						onSubmit={onSubmit}
						actionLabel={'Save'}
						disableTaskField={false}
						minCents={cents}
						isLoading={update.isLoading}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
