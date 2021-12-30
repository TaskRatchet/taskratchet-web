import { QueryObserverResult, useQuery } from 'react-query';
import { getTimezones } from './getTimezones';

export function useTimezones(): QueryObserverResult<string[]> {
	return useQuery('timezones', getTimezones);
}
