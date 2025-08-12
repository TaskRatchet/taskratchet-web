import { Box } from '@mui/material';
import { useState } from 'react';

import { useCloseWarning } from '../../lib/useCloseWarning';
import useDocumentTitle from '../../lib/useDocumentTitle';
import PlusFab from '../organisms/PlusFab';
import TaskList from '../organisms/TaskList';

interface TasksProps {
	lastToday: Date | undefined;
}

const Tasks = ({ lastToday }: TasksProps): JSX.Element => {
	const [newTask, setNewTask] = useState<TaskType>();

	useCloseWarning();

	useDocumentTitle('Tasks | TaskRatchet');

	return (
		<Box sx={{ pb: 12 }}>
			<TaskList lastToday={lastToday} newTask={newTask} />
			<PlusFab onSave={setNewTask} />
		</Box>
	);
};

export default Tasks;
