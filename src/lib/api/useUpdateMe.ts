import {
	useMutation,
	useQueryClient,
	UseBaseMutationResult,
} from 'react-query';
import { MeInput, updateMe as mutator } from './updateMe';

export default function useUpdateMe(): UseBaseMutationResult<
	Response,
	unknown,
	MeInput,
	unknown
> {
	const queryClient = useQueryClient();
	return useMutation(mutator, {
		onSuccess: async () => {
			await queryClient.invalidateQueries('me');
		},
	});
}
