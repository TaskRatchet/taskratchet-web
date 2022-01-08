import { QueryObserverResult, useQuery } from 'react-query';
import { getMe } from './getMe';
import { UseQueryOptions } from 'react-query';

export function useMe(
	queryOptions: UseQueryOptions<User> | undefined = {}
): QueryObserverResult<User, unknown> {
	return useQuery({
		queryKey: 'me',
		queryFn: getMe,
		...queryOptions,
	});
}
