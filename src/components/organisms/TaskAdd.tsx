import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import TaskForm from './TaskForm';
import React, { useState } from 'react';
import { useTimezone } from '../../lib/api/useTimezone';
import { useAddTask } from '../../lib/api/useAddTask';
import browser from '../../lib/Browser';

const getDefaultDue = () => {
	const due = browser.getNowDate();

	due.setDate(due.getDate() + 7);
	due.setHours(23);
	due.setMinutes(59);

	return due;
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
	const [due, setDue] = useState<Date>(() => {
		if (!baseTask) {
			return getDefaultDue();
		}

		if (new Date(baseTask.due) < browser.getNowDate()) {
			return getDefaultDue();
		}

		return new Date(baseTask.due);
	});
	const [cents, setCents] = useState<number>(baseTask?.cents || 500);
	const [error, setError] = useState<string>('');
	const minDue = browser.getNowDate();

	const onChange = (task: string, due: Date, cents: number) => {
		setTask(task);
		setDue(due);
		setCents(cents);
	};

	function onSubmit() {
		// TODO: Don't submit if the task is missing...
		setError(task ? '' : 'Task is required');
		if (!due || !cents) {
			return;
		}
		if (new Date(due) < minDue) {
			setError('Due date must be in the future');
			return;
		}
		const dueString = due.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
		addTask.mutate({ task, due: dueString, cents });
	}

	return (
		<Dialog onClose={onClose} open={isOpen}>
			<DialogTitle sx={{ pb: 0 }}>Add Task</DialogTitle>
			<DialogContent>
				<TaskForm
					task={task}
					due={due}
					cents={cents}
					timezone={timezone}
					error={error}
					onChange={onChange}
					onSubmit={onSubmit}
					isLoading={addTask.isLoading}
					minDue={minDue}
				/>
			</DialogContent>
		</Dialog>
	);
}
