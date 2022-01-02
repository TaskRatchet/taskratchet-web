import React, { useState } from 'react';
import './Tasks.css';
import 'react-datepicker/dist/react-datepicker.min.css';
import { useTasks } from '../../lib/api';
import TaskEntry from '../organisms/TaskEntry';
import TaskList from '../organisms/TaskList';
import { useCloseWarning } from '../../lib/useCloseWarning';
import LoadingSpinner from '../molecules/LoadingSpinner';

interface TasksProps {
	lastToday: Date | undefined;
	filters?: Filters;
}

const Tasks = ({ lastToday, filters }: TasksProps): JSX.Element => {
	const { isLoading } = useTasks();
	const [newTask, setNewTask] = useState<TaskType>();
	// const isLoading = true;

	useCloseWarning();

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<TaskList lastToday={lastToday} newTask={newTask} filters={filters} />
					<TaskEntry onSave={setNewTask} />
				</>
			)}
		</>
	);
};

export default Tasks;
