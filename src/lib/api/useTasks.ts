import { getTasks } from '@taskratchet/sdk';
import { useInfiniteQuery, type UseInfiniteQueryResult } from 'react-query';

const PAGE_SIZE = 20;

export function useTasks(): UseInfiniteQueryResult<TaskType[]> {
	// pageParam is the page number, starting from 0
	return useInfiniteQuery(
		'tasks',
		({ pageParam }: { pageParam?: number | null }) =>
			getTasks({ page: pageParam ?? 0 }),
		{
			getNextPageParam: (lastPage, allPages) => {
				if (lastPage?.length < PAGE_SIZE) return undefined;
				return allPages.length;
			},
			getPreviousPageParam: (_firstPage, allPages) => {
				if (allPages.length <= 1) return undefined;
				return allPages.length - 2;
			},
		},
	);
}
