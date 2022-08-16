import { useMutation, useQueryClient } from 'react-query';
import toaster from '../Toaster';
import { TaskInput, updateTask } from './updateTask';

interface Context {
	previousTasks: TaskType[] | undefined;
}

export function useUpdateTask(): (id: string, data: TaskInput) => void {
	const queryClient = useQueryClient();

	// TODO: replace any type
	const { mutate } = useMutation(
		(variables: { id: string; data: TaskInput }): Promise<unknown> => {
			const { id, data } = variables;

			return updateTask(id, data);
		},
		{
			onMutate: async (variables): Promise<Context> => {
				await queryClient.cancelQueries('tasks');

				const { id, data } = variables;
				const previousTasks: TaskType[] | undefined =
					queryClient.getQueryData('tasks');

				if (!previousTasks) return { previousTasks };

				const newTasks = previousTasks.map((t: TaskType) => {
					if (t.id !== id) return t;

					const newTask = { ...t, ...data };

					if ('complete' in data) {
						newTask['status'] = data['complete'] ? 'complete' : 'pending';
					}

					return newTask;
				});

				queryClient.setQueryData('tasks', () => newTasks);

				return { previousTasks };
			},
			onError: (error: Error, variables, context) => {
				queryClient.setQueryData('tasks', (context as Context).previousTasks);
				toaster.send(error.toString());
			},
			onSettled: async () => {
				await queryClient.invalidateQueries('tasks');
			},
		}
	);

	return (id: string, data: TaskInput): void => {
		mutate({ id, data });
	};
}
