import { type QueryObserverResult, useQuery } from 'react-query';
import type { UseQueryOptions } from 'react-query';
import { type User, getMe } from '@taskratchet/sdk';

export function useMe(
	queryOptions: UseQueryOptions<User> | undefined = {},
): QueryObserverResult<User, unknown> {
	return useQuery({
		queryKey: 'me',
		queryFn: getMe,
		...queryOptions,
	});
}
