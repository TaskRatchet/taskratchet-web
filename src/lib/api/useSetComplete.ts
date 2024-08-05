import { useUpdateTask } from './useUpdateTask';

export function useSetComplete(): (id: string, complete: boolean) => void {
	const u = useUpdateTask();

	return (id: string, complete: boolean) => u(id, { complete });
}
