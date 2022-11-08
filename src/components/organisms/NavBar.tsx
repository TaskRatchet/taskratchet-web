import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import NavDrawer from '../molecules/NavDrawer';
import FilterButton from '../molecules/FilterButton';
import { AppBar, Box, IconButton, Toolbar, Tooltip } from '@mui/material';
import { Today, Menu } from '@mui/icons-material';
import LoadingIndicator from '../molecules/LoadingIndicator';

interface NavBarProps {
	onTodayClick?: () => void;
}

export default function NavBar({ onTodayClick }: NavBarProps): JSX.Element {
	const location = useLocation();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const toggleMenu = () => setIsOpen(!isOpen);
	const handleTodayClick = () => {
		onTodayClick && onTodayClick();
		navigate('/');
	};

	useEffect(() => setIsOpen(false), [location]);

	return (
		<AppBar className={'organism-navBar'} position="relative">
			<Box position={'absolute'} sx={{ width: 1 }}>
				<LoadingIndicator />
			</Box>

			<Toolbar>
				<Link
					to={'/'}
					style={{
						display: 'flex',
						flexGrow: 1,
					}}
				>
					<img
						src="/android-chrome-192x192.png"
						height={32}
						width={32}
						alt="TaskRatchet"
					/>
				</Link>

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
