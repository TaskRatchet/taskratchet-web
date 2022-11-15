import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import NavDrawer from '../molecules/NavDrawer';
import FilterButton from '../molecules/FilterButton';
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Tab,
	Tabs,
	Toolbar,
	Tooltip,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import LoadingIndicator from '../molecules/LoadingIndicator';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { H } from 'highlight.run';

export default function NavBar(): JSX.Element {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const toggleMenu = () => setIsOpen(!isOpen);

	useEffect(() => setIsOpen(false), [location]);

	return (
		<AppBar className={'organism-navBar'} position="relative">
			<Box position={'absolute'} sx={{ width: 1 }}>
				<LoadingIndicator />
			</Box>

			<Toolbar
				sx={{
					justifyContent: 'space-between',
				}}
				variant="dense"
			>
				<Link
					to={'/'}
					style={{
						display: 'flex',
					}}
				>
					<img
						src="/android-chrome-192x192.png"
						height={32}
						width={32}
						alt="TaskRatchet"
					/>
				</Link>

				<Tabs textColor="inherit" value={location.pathname}>
					<Tab
						label="Next"
						value="/"
						to={'/'}
						component={Link}
						sx={{
							minWidth: 0,
							p: 1,
						}}
					/>
					<Tab
						label="Maybe"
						value="/maybe"
						to={'/maybe'}
						component={Link}
						sx={{
							minWidth: 0,
							p: 1,
						}}
					/>
					<Tab
						label="Archive"
						value="/archive"
						to={'/archive'}
						component={Link}
						sx={{
							minWidth: 0,
							p: 1,
						}}
					/>
				</Tabs>

				<Box>
					<FilterButton />

				<Tooltip title={'Feedback'}>
					<IconButton
						onClick={() => H.toggleSessionFeedbackModal()}
						edge="start"
						color="inherit"
						aria-label="feedback"
						sx={{ m: 0.1 }}
					>
						<FeedbackIcon />
					</IconButton>
				</Tooltip>

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
        </Box>
			</Toolbar>

			<NavDrawer isOpen={isOpen} onClose={toggleMenu} />
		</AppBar>
	);
}
