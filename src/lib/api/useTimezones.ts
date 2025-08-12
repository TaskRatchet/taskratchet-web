import { getTimezones } from '@taskratchet/sdk';
import { type QueryObserverResult, useQuery } from 'react-query';

export function useTimezones(): QueryObserverResult<string[]> {
	return useQuery('timezones', getTimezones);
}
