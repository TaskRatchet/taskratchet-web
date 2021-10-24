import { QueryObserverResult, useQuery } from 'react-query';
import { getTasks } from './getTasks';

export function useTasks(): QueryObserverResult<TaskType[]> {
	return useQuery('tasks', getTasks);
}
