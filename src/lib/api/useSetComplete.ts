import { useUpdateTask } from './useUpdateTask';

export function useSetComplete(): (
	id: number | string,
	complete: boolean
) => void {
	const updateTask = useUpdateTask();

	return (id: number | string, complete: boolean) =>
		updateTask(id, {
			complete: complete,
		});
}
