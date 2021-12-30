import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { useAddTask } from '../../lib/api/useAddTask';
import { useTimezone } from '../../lib/api/useTimezone';

const TaskEntry = ({
	onSave,
}: {
	onSave: (t: TaskType) => void;
}): JSX.Element => {
	const timezone = useTimezone() || '';
	const addTask = useAddTask(onSave);
	const [task, setTask] = useState<string>('');
	const [due, setDue] = useState<Date | null>(null);
	const [cents, setCents] = useState<number | null>(null);
	const [error, setError] = useState<string>('');

	const onChange = (task: string, due: Date | null, cents: number | null) => {
		setTask(task);
		setDue(due);
		setCents(cents);
	};

	function onSubmit() {
		setError(task ? '' : 'Task is required');
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
		addTask(task, dueString, cents);
		setTask('');
		setDue(null);
		setCents(null);
	}

	return (
		<>
			<TaskForm
				task={task}
				due={due}
				cents={cents}
				timezone={timezone}
				error={error}
				onChange={onChange}
				onSubmit={onSubmit}
			/>

			{/*<FreeEntry*/}
			{/*    task={task}*/}
			{/*    due={due}*/}
			{/*    cents={cents}*/}
			{/*    timezone={timezone}*/}
			{/*    error={error}*/}
			{/*    onChange={onChange}*/}
			{/*    onSubmit={onSubmit}*/}
			{/*/>*/}
		</>
	);
};

export default TaskEntry;
