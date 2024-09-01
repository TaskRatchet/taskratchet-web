import {
	useMutation,
	type UseMutationResult,
	useQueryClient,
} from 'react-query';
import { editTask } from '@taskratchet/sdk';

type EditParams = { id: string; due: string; cents: number };

export default function useEditTask(): UseMutationResult<
	Response,
	Error,
	EditParams
> {
	const queryClient = useQueryClient();

	// TODO: use task id in mutation key
	return useMutation(
		['edit', 'task_id'],
		(data: EditParams) => {
			return editTask(data.id, data.due, data.cents);
		},
		{
			onSettled: async () => {
				await queryClient.refetchQueries('tasks');
			},
		},
	);
}
