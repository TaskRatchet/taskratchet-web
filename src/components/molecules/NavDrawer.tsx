import { logout, useSession } from '../../lib/api/useSession';
import { Link } from 'react-router-dom';
import React from 'react';
import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpIcon from '@mui/icons-material/Help';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								<ListItemText primary={'Logout'} />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton component={Link} to={'/account'} color="inherit">
								<ListItemIcon>
									<AccountCircleIcon />
								</ListItemIcon>
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
						<ListItemIcon>
							<HelpIcon />
						</ListItemIcon>
						<ListItemText primary={'Help'} />
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
	);
}
