import React, { MouseEvent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSetUncle } from '../../lib/api/useSetUncle';
import _ from 'lodash';

const ITEM_HEIGHT = 48;

export default function TaskMenu({ task }: { task: TaskType }) {
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
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="long-menu"
				anchorEl={anchorEl}
				keepMounted
				open={open}
				onClose={handleClose}
				PaperProps={{
					style: {
						maxHeight: ITEM_HEIGHT * 4.5,
						width: '20ch',
					},
				}}
			>
				<MenuItem
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
