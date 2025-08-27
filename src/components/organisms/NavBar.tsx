import { SignedIn, useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Today } from '@mui/icons-material';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
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
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import FilterButton from '../molecules/FilterButton';
import LoadingIndicator from '../molecules/LoadingIndicator';
import FeedbackButton from './FeedbackButton';

interface NavBarProps {
	onTodayClick?: () => void;
}

export default function NavBar({ onTodayClick }: NavBarProps): JSX.Element {
	const navigate = useNavigate();
	const handleTodayClick = () => {
		onTodayClick?.();
		navigate('/');
	};
	const { isSignedIn, user } = useUser();
	const clerk = useClerk();

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

				<Tooltip title={'Help'}>
					<IconButton
						component="a"
						href="https://taskratchet.com/help.html"
						target="_blank"
						rel="noopener noreferrer"
						edge="start"
						color="inherit"
						aria-label="help"
						sx={{ m: 0.1 }}
					>
						<HelpIcon />
					</IconButton>
				</Tooltip>

				<SignedIn>
					<Tooltip title={'Settings'}>
						<IconButton
							component="a"
							href="/settings"
							target="_blank"
							rel="noopener noreferrer"
							edge="start"
							color="inherit"
							aria-label="settings"
							sx={{ m: 0.1, mr: 1 }}
						>
							<SettingsIcon />
						</IconButton>
					</Tooltip>

					<UserButton />
				</SignedIn>
			</Toolbar>
		</AppBar>
	);
}
