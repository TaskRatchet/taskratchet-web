import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import {
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import { logout } from '@taskratchet/sdk';
import { Link } from 'react-router-dom';

import { useSession } from '../../lib/api/useSession';

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
			PaperProps={{
				sx: {
					width: 250,
					maxWidth: '100%',
				},
			}}
		>
			<List>
				{session && (
					<>
						<ListItem>
							<ListItemText>{session.email}</ListItemText>
						</ListItem>
						<Divider />
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
				<ListItem disablePadding>
					<ListItemButton
						component={'a'}
						href={'https://taskratchet.com/help.html'}
						target={'_blank'}
						color="inherit"
						rel={'noopener'}
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
