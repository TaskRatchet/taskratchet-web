import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import { useState } from 'react';

import TaskAdd from './TaskAdd';

const PlusFab = ({
	onSave,
}: {
	onSave: (t: TaskType) => void;
}): JSX.Element => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<>
			<Fab
				color="primary"
				aria-label="add"
				sx={{
					position: 'fixed',
					bottom: (theme) => theme.spacing(2),
					right: (theme) => theme.spacing(2),
				}}
				onClick={() => setIsOpen(true)}
			>
				<AddIcon />
			</Fab>

			<TaskAdd
				onSave={onSave}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
};

export default PlusFab;
