import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.min.css';
import PlusFab from '../organisms/PlusFab';
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
			<PlusFab onSave={setNewTask} />
		</>
	);
};

export default Tasks;
