import React from 'react';
import { useSession } from '../../lib/api/useSession';

const Authenticated = ({
	children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
	const session = useSession();

	if (session) return <>{children}</>;

	const prev = window.location.pathname + window.location.search;
	window.location.href = `/login.html?prev=${encodeURIComponent(prev)}`;

	return <>Redirecting...</>;
};

export default Authenticated;
