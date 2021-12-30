import {
	AppBar,
	Button,
	IconButton,
	Toolbar,
	Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import MenuIcon from '@material-ui/icons/Menu';
import TodayIcon from '@material-ui/icons/Today';
import { useLocation, useHistory } from 'react-router-dom';
import NavDrawer from '../molecules/NavDrawer';

interface NavBarProps {
	onTodayClick?: () => void;
}

export default function NavBar({ onTodayClick }: NavBarProps): JSX.Element {
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
					<IconButton
						onClick={handleTodayClick}
						edge="start"
						color="inherit"
						aria-label="today"
					>
						<TodayIcon />
					</IconButton>

					<IconButton
						onClick={toggleMenu}
						edge="start"
						color="inherit"
						aria-label="menu"
					>
						<MenuIcon />
					</IconButton>
				</span>
			</Toolbar>
			<NavDrawer isOpen={isOpen} onClose={toggleMenu} />
		</AppBar>
	);
}
