import React, { useState } from 'react';
import './Tasks.css';
import 'react-datepicker/dist/react-datepicker.min.css';
import { useTasks } from '../../lib/api';
import TaskEntry from '../organisms/TaskEntry';
import TaskList from '../organisms/TaskList';
import { useCloseWarning } from '../../lib/useCloseWarning';

interface TasksProps {
	lastToday: Date | undefined;
	filters?: Filters;
}

const Tasks = ({ lastToday, filters }: TasksProps): JSX.Element => {
	const { isLoading } = useTasks();
	const [newTask, setNewTask] = useState<TaskType>();

	useCloseWarning();

	return (
		<div className={`page-tasks ${isLoading ? 'loading' : 'idle'}`}>
			<TaskList lastToday={lastToday} newTask={newTask} filters={filters} />
			<TaskEntry onSave={setNewTask} />
		</div>
	);
};

export default Tasks;
