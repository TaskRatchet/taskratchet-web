import React from 'react';
import { Protect, RedirectToSignIn } from '@clerk/clerk-react';

const Authenticated = ({
	children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
	return <Protect fallback={<RedirectToSignIn />}>{children}</Protect>;
};

export default Authenticated;
