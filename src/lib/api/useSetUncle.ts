import { useUpdateTask } from './useUpdateTask';

export function useSetUncle(): (id: string) => void {
	const updateTask = useUpdateTask();

	return (id: string) => updateTask(id, { uncle: true });
}
