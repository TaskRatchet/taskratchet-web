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

const LoadingIndicator = () => {
	const isFetching = useIsFetching();

	return isFetching ? <TopBarProgress /> : null;
};

export default LoadingIndicator;
