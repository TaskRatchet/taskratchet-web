import { useInfiniteQuery, type UseInfiniteQueryResult } from 'react-query';
import { getTasks } from '@taskratchet/sdk';

const PAGE_SIZE = 20;

export function useTasks(): UseInfiniteQueryResult<TaskType[]> {
	// pageParam is the page number, starting from 0
	return useInfiniteQuery(
		'tasks',
		({ pageParam = 0 }: { pageParam?: number }) =>
			getTasks({ page: pageParam }),
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
