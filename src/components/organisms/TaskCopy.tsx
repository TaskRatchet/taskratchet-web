import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import TaskAdd from './TaskAdd';

export default function TaskCopy({
	task,
	onOpen,
}: {
	task: TaskType;
	onOpen?: () => void;
}): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<MenuItem
				onClick={() => {
					setIsOpen(true);
					if (onOpen) {
						onOpen();
					}
				}}
			>
				Copy
			</MenuItem>
			<TaskAdd
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onSave={() => null}
				baseTask={task}
			/>
		</>
	);
}
