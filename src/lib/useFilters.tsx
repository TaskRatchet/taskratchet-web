import { useCallback, useMemo } from 'react';
import { usePref } from './usePref';
import { getCookie } from './getCookie';
import pick from 'lodash/pick';
import defaults from 'lodash/defaults';

const DEFAULT_FILTERS = {
	pending: true,
	complete: true,
	expired: true,
};

const getDefaultFilters = (): { [key in Status]: boolean } => {
	const cookie = getCookie('tr-filters');
	let data;

	try {
		data = JSON.parse(cookie || '{}');
	} catch {
		return DEFAULT_FILTERS;
	}

	if (typeof data !== 'object') return DEFAULT_FILTERS;
	if (data === null) return DEFAULT_FILTERS;

	return defaults(pick(data, Object.keys(DEFAULT_FILTERS)), DEFAULT_FILTERS);
};

export default function useFilters(): {
	filters: { [key in Status]: boolean };
	setFilters: (filters: { [key in Status]: boolean }) => void;
	toggleFilter: (key: Status) => void;
} {
	const defaultFilters = useMemo(getDefaultFilters, []);

	const { pref: filters, setPref: setFilters } = usePref(
		'filters',
		defaultFilters
	);

	const toggleFilter = useCallback(
		(filter: Status) => {
			return setFilters({
				...filters,
				[filter]: !filters[filter],
			});
		},
		[filters, setFilters]
	);

	return {
		filters,
		setFilters,
		toggleFilter,
	};
}
