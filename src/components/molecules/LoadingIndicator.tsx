import { useIsFetching } from 'react-query';
import { LinearProgress } from '@mui/material';

const LoadingIndicator = (): JSX.Element | null => {
	const isFetching = useIsFetching();

	return (
		<div style={{ pointerEvents: 'none', height: 5, flexShrink: 0 }}>
			{isFetching ? <LinearProgress color={'secondary'} /> : null}
		</div>
	);
};

export default LoadingIndicator;
