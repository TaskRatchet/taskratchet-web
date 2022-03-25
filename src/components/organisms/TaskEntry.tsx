import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { useAddTask } from '../../lib/api/useAddTask';
import { useTimezone } from '../../lib/api/useTimezone';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogContent, DialogTitle, Fab } from '@mui/material';

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
	const [isOpen, setIsOpen] = useState<boolean>(false);

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
					/>
				</DialogContent>
			</Dialog>

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
