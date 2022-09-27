import { QueryObserverResult, useQuery } from 'react-query';
import { getMe } from './getMe';
import { UseQueryOptions } from 'react-query';
import { H } from 'highlight.run';
import { useEffect } from 'react';
import mapValues from 'lodash/mapValues';

export function useMe(
	queryOptions: UseQueryOptions<User> | undefined = {}
): QueryObserverResult<User, unknown> {
	const result = useQuery({
		queryKey: 'me',
		queryFn: getMe,
		...queryOptions,
	});

	const { data } = result;

	useEffect(() => {
		if (!data) return;
		H.identify(
			data.id,
			mapValues(data, (v) => v.toString())
		);
	}, [data]);

	return result;
}
