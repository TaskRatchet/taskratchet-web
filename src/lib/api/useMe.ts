import { getMe,type User } from '@taskratchet/sdk';
import type { UseQueryOptions } from 'react-query';
import { type QueryObserverResult, useQuery } from 'react-query';

export function useMe(
	queryOptions: UseQueryOptions<User> | undefined = {},
): QueryObserverResult<User, unknown> {
	return useQuery({
		queryKey: 'me',
		queryFn: getMe,
		...queryOptions,
	});
}
