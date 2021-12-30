import TopBarProgress from 'react-topbar-progress-indicator';
import React from 'react';
import { useIsFetching } from 'react-query';

TopBarProgress.config({
	barColors: {
		'0': '#00ceff',
		'1.0': '#e600ff',
	},
	barThickness: 7,
});

const LoadingIndicator = (): JSX.Element | null => {
	const isFetching = useIsFetching();

	return isFetching ? (
		<span style={{ pointerEvents: 'none' }}>
			<TopBarProgress />
		</span>
	) : null;
};

export default LoadingIndicator;
