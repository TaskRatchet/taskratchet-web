import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { useLocation, useHistory } from 'react-router-dom';
import NavDrawer from '../molecules/NavDrawer';
import FilterButton from '../molecules/FilterButton';
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import { Today, Menu } from '@mui/icons-material';
import LoadingIndicator from '../molecules/LoadingIndicator';

interface NavBarProps {
	onTodayClick?: () => void;
	onFilterChange?: (filters: Filters) => void;
}

export default function NavBar({
	onTodayClick,
	onFilterChange,
}: NavBarProps): JSX.Element {
	const location = useLocation();
	const history = useHistory();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const toggleMenu = () => setIsOpen(!isOpen);
	const handleTodayClick = () => {
		onTodayClick && onTodayClick();
		history.push('/');
	};

	useEffect(() => setIsOpen(false), [location]);

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

				<FilterButton onChange={onFilterChange} />

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
