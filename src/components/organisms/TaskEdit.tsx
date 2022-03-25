import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { useTimezone } from '../../lib/api/useTimezone';
import { Dialog, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { useMutation } from 'react-query';
import { editTask } from '../../lib/api/editTask';

const TaskEdit = ({
	task,
	onOpen,
}: {
	task: TaskType;
	onOpen?: () => void;
}): JSX.Element => {
	const timezone = useTimezone() || '';
	const [due, setDue] = useState<Date | null>(() => {
		return new Date(task.due);
	});
	const [cents, setCents] = useState<number | null>(task.cents);
	const [error, setError] = useState<string>('');
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { mutate } = useMutation(
		['edit', 'task_id'],
		(data: { id: string; due: string; cents: number }) => {
			return editTask(data.id, data.due, data.cents);
		}
	);

	const onChange = (task: string, due: Date | null, cents: number | null) => {
		setDue(due);
		setCents(cents);
	};

	function onSubmit() {
		if (!due || !cents) {
			return;
		}
		const dueString = due.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
		if (!task.id) {
			setError('Failed to edit task');
			return;
		}
		mutate({ id: task.id, due: dueString, cents });
	}

	return (
		<>
			<MenuItem
				onClick={() => {
					onOpen && onOpen();
					setIsOpen(true);
				}}
				disabled={!task.id || task.status !== 'pending'}
			>
				Edit
			</MenuItem>

			<Dialog onClose={() => setIsOpen(false)} open={isOpen}>
				<DialogTitle sx={{ pb: 0 }}>Edit Task</DialogTitle>
				<DialogContent>
					<TaskForm
						task={task.task}
						due={due}
						cents={cents}
						timezone={timezone}
						error={error}
						onChange={onChange}
						onSubmit={onSubmit}
						actionLabel={'Save'}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default TaskEdit;
