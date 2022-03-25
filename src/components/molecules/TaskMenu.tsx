import React, { MouseEvent } from 'react';
import { IconButton, Menu } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import TaskEdit from '../organisms/TaskEdit';
import UncleButton from '../organisms/UncleButton';

export default function TaskMenu({ task }: { task: TaskType }): JSX.Element {
	const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
	const open = Boolean(anchorEl);

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
				<UncleButton task={task} onClick={() => handleClose()} />
				<TaskEdit task={task} onOpen={() => handleClose()} />
			</Menu>
		</div>
	);
}
