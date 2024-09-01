import { type QueryObserverResult, useQuery } from 'react-query';
import { getTimezones } from '@taskratchet/sdk';

export function useTimezones(): QueryObserverResult<string[]> {
	return useQuery('timezones', getTimezones);
}
