import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { useAddTask } from '../../lib/api/useAddTask';
import { useTimezone } from '../../lib/api/useTimezone';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogContent, DialogTitle, Fab } from '@mui/material';
import browser from '../../lib/Browser';

const getDefaultDue = () => {
	const due = browser.getNowDate();

	due.setDate(due.getDate() + 7);
	due.setHours(23);
	due.setMinutes(59);

	return due;
};

const TaskEntry = ({
	onSave,
}: {
	onSave: (t: TaskType) => void;
}): JSX.Element => {
	const timezone = useTimezone() || '';
	const addTask = useAddTask(onSave);
	const [task, setTask] = useState<string>('');
	const [due, setDue] = useState<Date>(getDefaultDue);
	const [cents, setCents] = useState<number>(500);
	const [error, setError] = useState<string>('');
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onChange = (task: string, due: Date, cents: number) => {
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
		addTask.mutate({ task, due: dueString, cents });
	}

	return (
		<>
			<Fab
				color="primary"
				aria-label="add"
				sx={{
					position: 'fixed',
					bottom: (theme) => theme.spacing(2),
					right: (theme) => theme.spacing(2),
				}}
				onClick={() => setIsOpen(true)}
			>
				<AddIcon />
			</Fab>

			<Dialog onClose={() => setIsOpen(false)} open={isOpen}>
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
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default TaskEntry;
