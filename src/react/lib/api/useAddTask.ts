import {
	useMutation,
	type UseMutationResult,
	useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import { addTask } from '@taskratchet/sdk';

interface Input {
	task: string;
	due: number;
	cents: number;
}

export function useAddTask(
	onSave: (t: TaskType) => void,
): UseMutationResult<TaskType, Error, Input> {
	const queryClient = useQueryClient();

	return useMutation(addTask, {
		onMutate: async (newTask: Input) => {
			await queryClient.cancelQueries('tasks');

			const snapshot:
				| {
						pages: TaskType[][];
						pageParams?: number[];
				  }
				| undefined = queryClient.getQueryData('tasks');

			if (!snapshot) return { snapshot: undefined };

			const t = {
				status: 'pending',
				isNew: true,
				...newTask,
			} as TaskType;

			onSave(t);
			queryClient.setQueryData('tasks', {
				...snapshot,
				pages: [...snapshot.pages, [t]],
			});

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
	});
}
