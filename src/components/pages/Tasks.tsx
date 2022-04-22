import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.min.css';
import PlusFab from '../organisms/PlusFab';
import TaskList from '../organisms/TaskList';
import { useCloseWarning } from '../../lib/useCloseWarning';
import { Box } from '@mui/material';

interface TasksProps {
	lastToday: Date | undefined;
	filters?: Filters;
}

const Tasks = ({ lastToday, filters }: TasksProps): JSX.Element => {
	const [newTask, setNewTask] = useState<TaskType>();

	useCloseWarning();

	return (
		<Box sx={{ pb: 12 }}>
			<TaskList lastToday={lastToday} newTask={newTask} filters={filters} />
			<PlusFab onSave={setNewTask} />
		</Box>
	);
};

export default Tasks;
