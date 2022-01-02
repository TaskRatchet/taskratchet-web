import React, { Ref } from 'react';
import './Task.css';
import browser from '../../lib/Browser';
import TaskMenu from './TaskMenu';
import { useSetComplete } from '../../lib/api/useSetComplete';
import {
	Box,
	Checkbox,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';

import EventBusyIcon from '@mui/icons-material/EventBusy';

export interface TaskProps {
	task: TaskType;
	ref_?: Ref<HTMLDivElement>;
}

const Task = ({ task }: TaskProps): JSX.Element => {
	const setComplete = useSetComplete();
	const dueDate = new Date(task.due);
	const dateString = browser.getDateString(dueDate);
	const timeString = browser.getTimeString(dueDate);
	const disabled = !task.id || task.status === 'expired';

	return (
		<ListItem
			className={`molecule-task molecule-task__${task.status} ${
				task.isNew ? 'molecule-task__highlight' : ''
			}`}
			secondaryAction={<TaskMenu task={task} />}
			disablePadding
		>
			<ListItemButton
				disabled={disabled}
				onClick={() => {
					if (!task.id || disabled) return;
					setComplete(task.id, !task.complete);
				}}
			>
				<ListItemIcon>
					{task.status === 'expired' ? (
						<Box style={{ padding: 9 }}>
							<EventBusyIcon />
						</Box>
					) : (
						<Checkbox
							checked={task.complete}
							disabled={disabled}
							disableRipple
							inputProps={{
								'aria-labelledby': `task-${task.id}`,
							}}
						/>
					)}
				</ListItemIcon>
				<ListItemText
					id={`task-${task.id}`}
					primary={task.task || '[Description Missing]'}
					secondary={
						<span>
							due by{' '}
							<strong>
								{dateString} {timeString}
							</strong>{' '}
							or pay <strong>${task.cents / 100}</strong>
						</span>
					}
				/>
			</ListItemButton>
		</ListItem>
	);
};

export default Task;
