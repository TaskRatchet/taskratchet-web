import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
	Badge,
	Checkbox,
	FormControlLabel,
	IconButton,
	MenuList,
	Tooltip,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';

import useFilters from '../../lib/useFilters';

export default function FilterButton(): JSX.Element {
	const { filters, toggleFilter } = useFilters();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isOpen = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	function Entry({ label }: { label: Status }): JSX.Element {
		return (
			<MenuItem>
				<FormControlLabel
					control={
						<Checkbox
							checked={filters[label]}
							onChange={() => toggleFilter(label)}
						/>
					}
					label={label}
					aria-label={`toggle filter ${label}`}
				/>
			</MenuItem>
		);
	}

	return (
		<>
			<Tooltip title={'Filter Tasks'}>
				<IconButton
					id="filter-button"
					edge="start"
					color="inherit"
					aria-controls={isOpen ? 'filter-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={isOpen ? 'true' : undefined}
					aria-label={'filters'}
					onClick={handleClick}
					sx={{ m: 0.1 }}
				>
					<Badge
						badgeContent={Object.values(filters).filter((f) => !f).length}
						color={'secondary'}
					>
						<FilterAltIcon />
					</Badge>
				</IconButton>
			</Tooltip>
			<Menu
				id="filter-menu"
				anchorEl={anchorEl}
				open={isOpen}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				<MenuList>
					<Entry label={'pending'} />
					<Entry label={'complete'} />
					<Entry label={'expired'} />
				</MenuList>
			</Menu>
		</>
	);
}
