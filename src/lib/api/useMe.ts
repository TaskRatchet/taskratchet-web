import {useQuery, useQueryClient} from "react-query";

import {updateMe as mutator} from './updateMe'

import {useMutation} from "react-query";
import {getMe} from "./getMe";
import {UseQueryOptions} from 'react-query/types';
import toaster from "../Toaster";

const onError = (error: unknown) => {
    toaster.send((error as Error).toString());
}

interface UseMeReturnType {
    me: any
    updateMe: any
    isLoading: boolean
    isFetching: boolean
}

// TODO: fix updateMe type
export function useMe(
    queryOptions: UseQueryOptions | undefined = {}
): UseMeReturnType {
    const queryClient = useQueryClient()
    const {data: me, isLoading, isFetching} = useQuery('me', getMe, {
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
    return {me, updateMe, isLoading, isFetching}
}
