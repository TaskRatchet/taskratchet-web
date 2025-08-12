import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { updateTask, type TaskInput } from '@taskratchet/sdk';

interface Context {
	snapshot:
		| {
				pages: TaskType[][];
				pageParams?: number[];
		  }
		| undefined;
}

export function useUpdateTask(): (id: string, data: TaskInput) => void {
	const queryClient = useQueryClient();

	const { mutate } = useMutation(
		(variables: { id: string; data: TaskInput }): Promise<unknown> => {
			const { id, data } = variables;

			return updateTask(id, data);
		},
		{
			onMutate: async (variables): Promise<Context> => {
				await queryClient.cancelQueries('tasks');

				const { id, data } = variables;
				const snapshot:
					| {
							pages: TaskType[][];
							pageParams?: number[];
					  }
					| undefined = queryClient.getQueryData('tasks');

				if (!snapshot) return { snapshot: undefined };

				queryClient.setQueryData('tasks', () => ({
					...snapshot,
					pages: snapshot.pages.map((page) =>
						page.map((t) => {
							if (t.id !== id) return t;

							const newTask = { ...t, ...data };

							if ('complete' in data) {
								newTask['status'] = data['complete'] ? 'complete' : 'pending';
							}

							return newTask;
						}),
					),
				}));

				return { snapshot };
			},
			onError: (error: Error, _variables, context) => {
				queryClient.setQueryData('tasks', (context as Context).snapshot);
				toast(error.toString());
			},
			onSettled: async () => {
				await queryClient.invalidateQueries('tasks');
			},
		},
	);

	return (id: string, data: TaskInput): void => {
		mutate({ id, data });
	};
}
