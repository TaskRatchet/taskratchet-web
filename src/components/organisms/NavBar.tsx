import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { useLocation, useHistory } from 'react-router-dom';
import NavDrawer from '../molecules/NavDrawer';
import FilterButton from '../molecules/FilterButton';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { Today, Menu } from '@mui/icons-material';

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
		<AppBar className={'organism-navBar'} position="static">
			<Toolbar>
				<Typography
					className={'organism-navBar__title'}
					variant="h6"
					component="div"
				>
					<Button component={Link} to={'/'} color={'inherit'}>
						TaskRatchet
					</Button>
				</Typography>
				<span>
					<FilterButton onChange={onFilterChange} />

					<IconButton
						onClick={handleTodayClick}
						edge="start"
						color="inherit"
						aria-label="today"
					>
						<Today />
					</IconButton>

					<IconButton
						onClick={toggleMenu}
						edge="start"
						color="inherit"
						aria-label="menu"
					>
						<Menu />
					</IconButton>
				</span>
			</Toolbar>
			<NavDrawer isOpen={isOpen} onClose={toggleMenu} />
		</AppBar>
	);
}
