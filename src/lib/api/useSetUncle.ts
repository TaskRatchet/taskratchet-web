import { useUpdateTask } from './useUpdateTask';

export function useSetUncle(): (id: number | string) => void {
	const updateTask = useUpdateTask();

	return (id: number | string) => updateTask(id, { uncle: true });
}
