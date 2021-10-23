import { useUpdateTask } from './useUpdateTask';

export function useSetUncle() {
	const updateTask = useUpdateTask();

	return (id: number | string) => updateTask(id, { uncle: true });
}
