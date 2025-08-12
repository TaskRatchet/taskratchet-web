import { SignedIn, useClerk,UserButton, useUser } from '@clerk/clerk-react';
import { Menu,Today } from '@mui/icons-material';
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import { setAuthToken } from '@taskratchet/sdk';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import FilterButton from '../molecules/FilterButton';
import LoadingIndicator from '../molecules/LoadingIndicator';
import NavDrawer from '../molecules/NavDrawer';
import FeedbackButton from './FeedbackButton';

interface NavBarProps {
	onTodayClick?: () => void;
}

export default function NavBar({ onTodayClick }: NavBarProps): JSX.Element {
	const location = useLocation();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const toggleMenu = () => setIsOpen(!isOpen);
	const handleTodayClick = () => {
		onTodayClick?.();
		navigate('/');
	};
	const { isSignedIn, user } = useUser();
	const clerk = useClerk();

	useEffect(() => setIsOpen(false), [location]);

	useEffect(() => {
		if (!isSignedIn || !user) {
			setAuthToken(null);
			return;
		}

		void clerk.session?.getToken().then((t) => {
			setAuthToken(t ?? null);
		});
	}, [isSignedIn, user, clerk]);

	return (
		<AppBar className={'organism-navBar'} position="relative">
			<Box position={'absolute'} sx={{ width: 1 }}>
				<LoadingIndicator />
			</Box>

			<Toolbar>
				<Typography
					className={'organism-navBar__title'}
					variant="h6"
					component="div"
					sx={{ flexGrow: 1 }}
				>
					<Button component={Link} to={'/'} color={'inherit'}>
						TaskRatchet
					</Button>
				</Typography>

				<FilterButton />

				<Tooltip title={'Jump to Today'}>
					<IconButton
						onClick={handleTodayClick}
						edge="start"
						color="inherit"
						aria-label="today"
						sx={{ m: 0.1 }}
					>
						<Today />
					</IconButton>
				</Tooltip>

				<FeedbackButton />

				<SignedIn>
					<UserButton />
				</SignedIn>

				<Tooltip title={'Menu'}>
					<IconButton
						onClick={toggleMenu}
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ m: 0.1 }}
					>
						<Menu />
					</IconButton>
				</Tooltip>
			</Toolbar>

			<NavDrawer isOpen={isOpen} onClose={toggleMenu} />
		</AppBar>
	);
}
