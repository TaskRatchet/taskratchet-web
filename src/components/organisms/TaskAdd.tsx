import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import TaskForm from './TaskForm';
import React, { useState } from 'react';
import { useTimezone } from '../../lib/api/useTimezone';
import { useAddTask } from '../../lib/api/useAddTask';
import browser from '../../lib/Browser';
import formatDue from '../../lib/formatDue';

const getDefaultDue = () => {
	const due = browser.getNowDate();

	due.setDate(due.getDate() + 7);
	due.setHours(23);
	due.setMinutes(59);

	return formatDue(due);
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
	const timezone = useTimezone() || '';
	const addTask = useAddTask(onSave);
	const [task, setTask] = useState<string>(baseTask?.task || '');
	const [due, setDue] = useState<string>(() => {
		if (!baseTask) {
			return getDefaultDue();
		}

		if (new Date(baseTask.due) < browser.getNowDate()) {
			return getDefaultDue();
		}

		return baseTask.due;
	});
	const [cents, setCents] = useState<number>(baseTask?.cents || 500);
	const [recurrence, setRecurrence] = useState<Record<string, number>>({});
	const [error, setError] = useState<string>('');
	const minDue = browser.getNowDate();

	const onChange = ({ task, due, cents, recurrence }: Partial<TaskInput>) => {
		if (task !== undefined) setTask(task);
		if (due !== undefined) setDue(due);
		if (cents !== undefined) setCents(cents);
		if (recurrence !== undefined) setRecurrence(recurrence);
	};

	function onSubmit() {
		if (!task) {
			setError('Task is required');
			return;
		}
		if (!due || !cents) {
			return;
		}
		if (new Date(due) < minDue) {
			setError('Due date must be in the future');
			return;
		}
		const lines = task.split(/\r?\n/);
		lines.forEach((l) =>
			addTask.mutate({
				task: l,
				due,
				cents,
				recurrence: Object.keys(recurrence).length ? recurrence : undefined,
			})
		);
		throw new Error('onSubmit');
	}

	return (
		<Dialog onClose={onClose} open={isOpen}>
			<DialogTitle sx={{ pb: 0 }}>Add Task</DialogTitle>
			<DialogContent>
				<TaskForm
					task={task}
					due={due}
					cents={cents}
					recurrence={recurrence}
					timezone={timezone}
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
