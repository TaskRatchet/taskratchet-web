import { QueryObserverResult, useQuery } from 'react-query';
import { UseQueryOptions } from 'react-query';
import { H } from 'highlight.run';
import { useEffect } from 'react';
import { User, getMe } from '@taskratchet/sdk';

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

		const metadata = Object.keys(data).reduce((prev, key) => {
			const value = data[key as keyof User];

			prev[key] = typeof value === 'string' ? value : JSON.stringify(value);

			return prev;
		}, {} as Record<string, string>);

		H.identify(data.id, metadata);
	}, [data]);

	return result;
}
