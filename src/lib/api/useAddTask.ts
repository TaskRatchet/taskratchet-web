import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { addTask } from './addTask';
import { toast } from 'react-toastify';

interface Input {
	task: string;
	due: string;
	cents: number;
}

export function useAddTask(
	onSave: (t: TaskType) => void
): UseMutationResult<Response, Error, Input> {
	const queryClient = useQueryClient();

	return useMutation(
		({ task, due, cents }: Input) => {
			// TODO: Refactor addTask to make closure unnecessary
			return addTask(task, due, cents);
		},
		{
			onMutate: async (newTask: Input) => {
				await queryClient.cancelQueries('tasks');

				const snapshot: TaskType[] | undefined =
					queryClient.getQueryData('tasks') || [];

				const t = {
					status: 'pending',
					isNew: true,
					...newTask,
				} as TaskType;

				onSave(t);
				queryClient.setQueryData('tasks', [...snapshot, t]);

				return { snapshot };
			},
			onError: (error: Error, newTask: Input, context) => {
				const { snapshot = null } = context || {};
				if (snapshot !== null) {
					queryClient.setQueryData('tasks', snapshot);
				}
				toast(error.toString());
			},
			onSettled: async () => {
				await queryClient.invalidateQueries('tasks');
			},
		}
	);
}
