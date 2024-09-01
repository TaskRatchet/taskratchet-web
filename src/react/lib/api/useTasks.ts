import { type QueryObserverResult, useQuery } from 'react-query';
import { getTasks } from '@taskratchet/sdk';

export function useTasks(): QueryObserverResult<TaskType[]> {
	return useQuery('tasks', getTasks);
}
