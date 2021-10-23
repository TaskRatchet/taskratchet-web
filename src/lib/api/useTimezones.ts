import { useQuery } from 'react-query';
import { getTimezones } from './getTimezones';

export function useTimezones() {
	return useQuery('timezones', getTimezones);
}
