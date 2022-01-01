import { logout, useSession } from '../../lib/api/useSession';
import { Link } from 'react-router-dom';
import React from 'react';
import { Button, Drawer, Typography } from '@mui/material';

export default function NavDrawer({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}): JSX.Element {
	const session = useSession();

	return (
		<Drawer
			className={'organism-navBar__drawer'}
			anchor={'right'}
			open={isOpen}
			onClose={onClose}
		>
			{session && (
				<>
					<Typography>{session.email}</Typography>
					<Button className={'link'} onClick={logout} color="inherit">
						Logout
					</Button>
					<Button component={Link} to={'/account'} color="inherit">
						Account
					</Button>
				</>
			)}
			{/*TODO: rel noopener etc*/}
			<Button
				href={'https://docs.taskratchet.com'}
				target={'_blank'}
				color="inherit"
			>
				Help
			</Button>
		</Drawer>
	);
}
