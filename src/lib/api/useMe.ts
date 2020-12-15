import {useQuery, useQueryClient} from "react-query";

import {updateMe as mutator} from './updateMe'

import {useMutation} from "react-query";
import {getMe} from "./getMe";
import {UseQueryOptions, UseMutationOptions} from 'react-query/types';
import toaster from "../Toaster";

const onError = (error: unknown) => {
    toaster.send((error as Error).toString());
}

// TODO: fix updateMe type
export function useMe(
    queryOptions: UseQueryOptions | undefined = {}
): { me: Response | undefined, updateMe: any, isLoading: boolean } {
    const queryClient = useQueryClient()
    const {data: me, isLoading} = useQuery('me', getMe, {
        onError,
        ...queryOptions
    })

    // TODO: fix types
    const {mutate: updateMe} = useMutation(mutator, {
        onSuccess: async (data) => {
            await queryClient.invalidateQueries('me')
        },
        onError
    })

    // TODO: Fix me type
    return {me, updateMe, isLoading}
}
