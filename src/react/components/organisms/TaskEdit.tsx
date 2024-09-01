import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { useTimezone } from '../../lib/api/useTimezone';
import { Dialog, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import useEditTask from '../../lib/api/useEditTask';

const TaskEdit = ({
	task,
	onOpen,
}: {
	task: TaskType;
	onOpen?: () => void;
}): JSX.Element => {
	const timezone = useTimezone() || '';
	const [due, setDue] = useState<string>(task.due);
	const [cents, setCents] = useState<number>(task.cents);
	const [error, setError] = useState<string>('');
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const editTask = useEditTask();

	const onChange = ({ due, cents }: Partial<TaskInput>) => {
		if (due !== undefined) setDue(due);
		if (cents !== undefined) setCents(cents);
	};

	function onSubmit() {
		if (!due || !cents) {
			return;
		}
		if (cents < task.cents) {
			setError('Stakes cannot be less than the original task');
			return;
		}
		if (new Date(due) > new Date(task.due)) {
			setError('Cannot postpone due date');
			return;
		}
		if (task.id === undefined) {
			setError('Failed to edit task');
			return;
		}
		editTask.mutate(
			{ id: task.id, due, cents },
			{
				onSuccess: () => {
					setIsOpen(false);
				},
			},
		);
	}

	return (
		<>
			<MenuItem
				onClick={() => {
					onOpen?.();
					setIsOpen(true);
				}}
				disabled={!task.id || task.status !== 'pending'}
			>
				Edit
			</MenuItem>

			<Dialog onClose={() => setIsOpen(false)} open={isOpen}>
				<DialogTitle>Edit Task</DialogTitle>
				<DialogContent dividers>
					<TaskForm
						task={task.task}
						due={due}
						cents={cents}
						timezone={timezone}
						error={editTask.error?.message || error || ''}
						onChange={onChange}
						onCancel={() => setIsOpen(false)}
						onSubmit={onSubmit}
						actionLabel={'Save'}
						disableTaskField={true}
						minCents={task.cents}
						maxDue={new Date(task.due)}
						isLoading={editTask.isLoading}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default TaskEdit;
