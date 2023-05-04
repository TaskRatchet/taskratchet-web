import { QueryObserverResult, useQuery } from 'react-query';
import { getTasks } from './getTasks';
import formatDue from '../formatDue';
import { useMe } from './useMe';

type NewTaskType = {
	id: string;
	task: string;
	due: number;
	cents: number;
	complete: boolean;
	status: 'pending' | 'complete' | 'expired';
};

export function useTasks(): QueryObserverResult<TaskType[]> {
	const { data: me } = useMe();

	return useQuery('tasks', async () => {
		const data = (await getTasks()) as NewTaskType[];
		return (data || []).map((t: NewTaskType): TaskType => {
			return {
				...t,
				due_timestamp: t.due,
				due: formatDue(new Date(t.due * 1000), me?.timezone),
				timezone: me?.timezone || '',
			};
		});
	});
}
