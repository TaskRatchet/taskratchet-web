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
	Toolbar,
	Tooltip,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import LoadingIndicator from '../molecules/LoadingIndicator';

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

				<Box>
					<Button color="inherit" component={Link} to={'/'}>
						Next
					</Button>
					<Button color="inherit" component={Link} to={'/maybe'}>
						Maybe
					</Button>
					<Button color="inherit" component={Link} to={'/archive'}>
						Archive
					</Button>
				</Box>

				<Box>
					<FilterButton />

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
