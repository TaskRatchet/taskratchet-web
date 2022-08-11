import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { addTask } from './addTask';
import toaster from '../Toaster';

export function useAddTask(
	onSave: (t: TaskType) => void
): UseMutationResult<Response, Error, TaskInput> {
	const queryClient = useQueryClient();

	return useMutation(
		({ task, due, cents, recurrence }: TaskInput) => {
			// TODO: Refactor addTask to make closure unnecessary
			return addTask(task, due, cents, recurrence);
		},
		{
			onMutate: async (newTask: TaskInput) => {
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
			onError: (error: Error, newTask: TaskInput, context) => {
				const { snapshot = null } = context || {};
				if (snapshot !== null) {
					queryClient.setQueryData('tasks', snapshot);
				}
				toaster.send(error.toString());
			},
			onSettled: async () => {
				await queryClient.invalidateQueries('tasks');
			},
		}
	);
}
