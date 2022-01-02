import { logout, useSession } from '../../lib/api/useSession';
import { Link } from 'react-router-dom';
import React from 'react';
import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material';

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
			<List>
				{session && (
					<>
						<ListItem>
							<ListItemText>{session.email}</ListItemText>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton
								className={'link'}
								onClick={logout}
								color="inherit"
							>
								<ListItemText primary={'Logout'} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton component={Link} to={'/account'} color="inherit">
								<ListItemText primary={'Account'} />
							</ListItemButton>
						</ListItem>
					</>
				)}
				{/*TODO: rel noopener etc*/}
				<ListItem disablePadding>
					<ListItemButton
						href={'https://docs.taskratchet.com'}
						target={'_blank'}
						color="inherit"
					>
						<ListItemText primary={'Help'} />
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
	);
}
