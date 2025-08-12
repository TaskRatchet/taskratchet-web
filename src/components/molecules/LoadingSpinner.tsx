import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export default function LoadingSpinner(): JSX.Element {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: 1,
			}}
		>
			<CircularProgress aria-label={'loading'} />
		</Box>
	);
}
