import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { IconButton } from '@material-ui/core';
import React, { useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Checkbox, FormControlLabel, MenuList } from '@mui/material';
import useCookie from '../../lib/useCookie';

export const DEFAULT_FILTERS = {
	pending: true,
	complete: true,
	expired: true,
};

export default function FilterButton({
	onChange,
}: {
	onChange?: (filters: Filters) => void;
}): JSX.Element {
	const [filters, setFilters] = useCookie<Filters>(
		'tr-filters',
		DEFAULT_FILTERS
	);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isOpen = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const toggleFilter = (filter: Status) => {
		setFilters(
			{
				...filters,
				[filter]: !filters[filter],
			},
			60
		);
	};

	useEffect(() => {
		onChange && onChange(filters);
	}, [filters, onChange]);

	function Entry({ label }: { label: Status }): JSX.Element {
		return (
			<MenuItem>
				<FormControlLabel
					control={
						<Checkbox
							checked={filters[label]}
							onClick={() => toggleFilter(label)}
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
			<IconButton
				id="filter-button"
				edge="start"
				color="inherit"
				aria-controls={isOpen ? 'filter-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={isOpen ? 'true' : undefined}
				aria-label={'filters'}
				onClick={handleClick}
			>
				<FilterAltIcon />
			</IconButton>
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
