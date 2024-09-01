import React from 'react';
import LoginForm from '../organisms/Login';
import { useSession } from '../../lib/api/useSession';
import { Box, Link } from '@mui/material';

const Authenticated = ({
	children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
	const session = useSession();

	if (session) return <>{children}</>;

	return (
		<Box sx={{ p: 2 }}>
			<p>
				Please login or <Link href={'/register'}>register</Link> to view this
				page.
			</p>
			<LoginForm />
		</Box>
	);
};

export default Authenticated;
