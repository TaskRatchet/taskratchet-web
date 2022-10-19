import React, { Ref, Suspense } from 'react';
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
} from '@mui/material';
import { red } from '@mui/material/colors';

import EventBusyIcon from '@mui/icons-material/EventBusy';
import useIsDue from '../../lib/useIsDue';

const LazyDiffToNow = React.lazy(() => import('../atoms/diffToNow'));

export interface TaskProps {
	task: TaskType;
	ref_?: Ref<HTMLDivElement>;
}

const Task = ({ task }: TaskProps): JSX.Element => {
	const setComplete = useSetComplete();
	const isDue = useIsDue(task);
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
							'aria-labelledby': `task-${task.id || 'new'}`,
						}}
					/>
				)}
			</ListItemIcon>
			<ListItemText
				id={`task-${task.id || 'new'}`}
				primary={task.task || '[Description Missing]'}
				secondary={
					<>
						${task.cents / 100} &#8226; due by {dateString} {timeString} &#8226;{' '}
						<Suspense fallback="">
							<LazyDiffToNow task={task} />
						</Suspense>
					</>
				}
				sx={{ mr: 7 }}
			/>
		</ListItem>
	);
};

export default Task;
