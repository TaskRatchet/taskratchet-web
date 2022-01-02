import React, { MouseEvent } from 'react';
import { useSetUncle } from '../../lib/api/useSetUncle';
import _ from 'lodash';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

export default function TaskMenu({ task }: { task: TaskType }): JSX.Element {
	const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
	const open = Boolean(anchorEl);
	const setUncle = useSetUncle();

	const handleClick = (event: MouseEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton
				aria-label="Menu"
				aria-controls="long-menu"
				aria-haspopup="true"
				onClick={handleClick}
			>
				<MoreVert />
			</IconButton>
			<Menu
				id="long-menu"
				anchorEl={anchorEl}
				keepMounted
				open={open}
				onClose={handleClose}
			>
				<MenuItem
					disabled={task.status !== 'pending'}
					onClick={() => {
						handleClose();
						const taskId = _.get(task, 'id');
						if (taskId) {
							setUncle(taskId);
						}
					}}
				>
					{'Charge immediately'}
				</MenuItem>
			</Menu>
		</div>
	);
}
