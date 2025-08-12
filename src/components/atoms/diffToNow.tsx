import { Typography } from '@mui/material';
import useDifferenceToNow from '../../lib/useDifferenceToNow';
import useIsDue from '../../lib/useIsDue';

export default function DiffToNow({ task }: { task: TaskType }): JSX.Element {
	const isDue = useIsDue(task);
	const difference = useDifferenceToNow(task);

	return (
		<Typography
			component={'span'}
			color={isDue ? 'error' : 'inherit'}
			sx={{ fontSize: 'inherit' }}
		>
			{difference}
		</Typography>
	);
}
