import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
} from '@mui/material';
import React from 'react';
import { useSetUncle } from '../../lib/api/useSetUncle';

export default function UncleButton({
	task,
	onClick,
}: {
	task: TaskType;
	onClick?: () => void;
}): JSX.Element {
	const setUncle = useSetUncle();
	const [open, setOpen] = React.useState(false);

	return (
		<>
			<MenuItem
				/* TODO: Disable if task id not set */
				disabled={task.status !== 'pending'}
				onClick={() => {
					onClick && onClick();
					setOpen(true);
				}}
			>
				{'Charge immediately'}
			</MenuItem>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Charge Immediately?</DialogTitle>
				<DialogContent dividers>
					<p>Are you sure you want to charge this task immediately?</p>
					<p>
						If you confirm, you will immediately be charged ${task.cents / 100}.
					</p>
				</DialogContent>
				<DialogActions>
					<Button
						autoFocus
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							setOpen(false);
							if (task?.id) {
								setUncle(task.id);
							}
						}}
					>
						Charge
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
