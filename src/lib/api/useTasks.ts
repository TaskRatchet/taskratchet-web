import { QueryObserverResult, useQuery } from 'react-query';
import { getTasks } from './getTasks';

export function useTasks(): QueryObserverResult<any> {
	return useQuery('tasks', getTasks);
}
