import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import logEvent from '../../lib/logEvent';
import TaskAdd from './TaskAdd';
import { EventCategory, EventAction } from '../../lib/logEvent';

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
					logEvent({
						category: EventCategory.Task,
						action: EventAction.TaskCopy,
						value: task.cents / 100,
					});
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
