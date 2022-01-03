import { useQuery, useQueryClient } from 'react-query';

import { MeInput, updateMe as mutator } from './updateMe';

import { useMutation, UseMutateFunction } from 'react-query';
import { getMe } from './getMe';
import { UseQueryOptions } from 'react-query';
import toaster from '../Toaster';

const onError = (error: unknown) => {
	toaster.send((error as Error).toString());
};

interface UseMeReturnType {
	me: User;
	updateMe: UseMutateFunction<Response, unknown, MeInput>;
	isLoading: boolean;
	isUpdating: boolean;
	isFetching: boolean;
}

// TODO: fix updateMe type
export function useMe(
	queryOptions: UseQueryOptions<User> | undefined = {}
): UseMeReturnType {
	const queryClient = useQueryClient();
	const {
		data: me,
		isLoading,
		isFetching,
	} = useQuery({ queryKey: 'me', queryFn: getMe, onError, ...queryOptions });

	const { mutate: updateMe, isLoading: isUpdating } = useMutation(mutator, {
		onSuccess: async () => {
			await queryClient.invalidateQueries('me');
		},
		onError,
	});

	return { me, updateMe, isLoading, isUpdating, isFetching } as UseMeReturnType;
}
