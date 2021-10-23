import React from 'react';
import LoginForm from '../organisms/Login';
import { Link } from 'react-router-dom';
import { useSession } from '../../lib/api/useSession';
import './Authenticated.css';

interface AuthenticatedProps {}

const Authenticated = ({
	children,
}: React.PropsWithChildren<AuthenticatedProps>) => {
	const session = useSession();

	if (session) return <>{children}</>;

	return (
		<div className={'page-authenticated'}>
			<p>
				Please login or <Link to={'/register'}>register</Link> to view this
				page.
			</p>
			<LoginForm />
		</div>
	);
};

export default Authenticated;
