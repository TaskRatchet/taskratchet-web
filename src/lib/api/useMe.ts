import { useQuery, useQueryClient } from 'react-query';

import { MeInput, updateMe as mutator } from './updateMe';

import { useMutation, UseMutateFunction } from 'react-query';
import { getMe } from './getMe';
import { UseQueryOptions } from 'react-query/types';
import toaster from '../Toaster';

const onError = (error: unknown) => {
	toaster.send((error as Error).toString());
};

interface UseMeReturnType {
	me: User;
	updateMe: UseMutateFunction<Response, unknown, MeInput>;
	isLoading: boolean;
	isFetching: boolean;
}

// TODO: fix updateMe type
export function useMe(
	queryOptions: UseQueryOptions | undefined = {}
): UseMeReturnType {
	const queryClient = useQueryClient();
	const {
		data: me,
		isLoading,
		isFetching,
	} = useQuery('me', getMe, {
		onError,
		...queryOptions,
	});

	const { mutate: updateMe } = useMutation(mutator, {
		onSuccess: async () => {
			await queryClient.invalidateQueries('me');
		},
		onError,
	});

	return { me, updateMe, isLoading, isFetching } as UseMeReturnType;
}
