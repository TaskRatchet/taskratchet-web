import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.min.css';
import TaskEntry from '../organisms/TaskEntry';
import TaskList from '../organisms/TaskList';
import { useCloseWarning } from '../../lib/useCloseWarning';

interface TasksProps {
	lastToday: Date | undefined;
	filters?: Filters;
}

const Tasks = ({ lastToday, filters }: TasksProps): JSX.Element => {
	const [newTask, setNewTask] = useState<TaskType>();

	useCloseWarning();

	return (
		<>
			<TaskList lastToday={lastToday} newTask={newTask} filters={filters} />
			<TaskEntry onSave={setNewTask} />
		</>
	);
};

export default Tasks;
