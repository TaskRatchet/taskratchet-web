import React, { Ref } from 'react';
import './Task.css';
import browser from '../../lib/Browser';
import TaskMenu from './TaskMenu';
import { useSetComplete } from '../../lib/api/useSetComplete';
import {
	Box,
	Checkbox,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';

import EventBusyIcon from '@mui/icons-material/EventBusy';
import { differenceInHours, formatDistanceToNow } from 'date-fns';

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
	const difference = differenceInHours(dueDate, new Date());
	const isDue = difference >= 0 && difference < 24;

	return (
		<ListItem
			className={`molecule-task molecule-task__${task.status} ${
				task.isNew ? 'molecule-task__highlight' : ''
			}`}
			secondaryAction={<TaskMenu task={task} />}
			disablePadding
			sx={{
				borderLeft: isDue ? 3 : 0,
				borderColor: red[600],
			}}
			dense
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
						onClick={() => {
							if (!task.id || disabled) return;
							setComplete(task.id, !task.complete);
						}}
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
					<>
						${task.cents / 100} &#8226; due by {dateString} {timeString} &#8226;{' '}
						<Typography
							component={'span'}
							color={isDue ? 'error' : 'inherit'}
							sx={{ fontSize: 'inherit' }}
						>
							{formatDistanceToNow(dueDate, {
								addSuffix: true,
								includeSeconds: true,
							})}
						</Typography>
					</>
				}
				sx={{ mr: 7 }}
			/>
		</ListItem>
	);
};

export default Task;
