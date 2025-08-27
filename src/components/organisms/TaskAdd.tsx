import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';

import { useAddTask } from '../../lib/api/useAddTask';
import * as browser from '../../lib/browser';
import TaskForm from './TaskForm';

const getDefaultDue = () => {
	const due = browser.getNowDate();

	due.setDate(due.getDate() + 7);
	due.setHours(23);
	due.setMinutes(59);

	return due.getTime() / 1000;
};

export default function TaskAdd({
	isOpen,
	onClose,
	onSave,
	baseTask,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSave: (t: TaskType) => void;
	baseTask?: TaskType;
}): JSX.Element {
	const addTask = useAddTask(onSave);
	const [task, setTask] = useState<string>(baseTask?.task || '');
	const [due, setDue] = useState<number>(() => {
		if (!baseTask) {
			return getDefaultDue();
		}

		if (new Date(baseTask.due * 1000) < browser.getNowDate()) {
			return getDefaultDue();
		}

		return baseTask.due;
	});
	const [cents, setCents] = useState<number>(baseTask?.cents || 500);
	const [error, setError] = useState<string>('');
	const minDue = browser.getNowDate();

	const onChange = ({ task, due, cents }: Partial<TaskInput>) => {
		if (task !== undefined) setTask(task);
		if (due !== undefined) setDue(due);
		if (cents !== undefined) setCents(cents);
	};

	function onSubmit() {
		if (!task) {
			setError('Task is required');
			return;
		}
		if (!due) {
			setError('Deadline is required');
			return;
		}
		if (cents < 100) {
			setError('Minimum stakes is $1.00');
			return;
		}
		if (new Date(due * 1000) < minDue) {
			setError('Due date must be in the future');
			return;
		}
		const lines = task.split(/\r?\n/);
		lines.forEach((l) => addTask.mutate({ task: l, due, cents }));
	}

	return (
		<Dialog onClose={onClose} open={isOpen}>
			<DialogTitle sx={{ pb: 0 }}>Add Task</DialogTitle>
			<DialogContent>
				<TaskForm
					task={task}
					due={due}
					cents={cents}
					error={error}
					onChange={onChange}
					onCancel={onClose}
					onSubmit={onSubmit}
					isLoading={addTask.isLoading}
					minDue={minDue}
				/>
			</DialogContent>
		</Dialog>
	);
}
