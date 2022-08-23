import { useUpdateTask } from './useUpdateTask';

export function useSetComplete(): (id: string, complete: boolean) => void {
	const updateTask = useUpdateTask();

	return (id: string, complete: boolean) =>
		updateTask(id, {
			complete: complete,
		});
}
