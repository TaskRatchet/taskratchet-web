import {QueryResult, useQuery} from "react-query";

import {updateMe as mutator} from './updateMe'

import {queryCache, useMutation} from "react-query";
import {getMe} from "./getMe";
import {UseQueryOptions, UseMutationOptions} from 'react-query/types';

// TODO: fix updateMe type
export function useMe(
    queryOptions: UseQueryOptions | undefined = {},
    mutateOptions: UseMutationOptions | undefined = {}
): { me: Response | undefined, updateMe: any } {
    const {data: me, isLoading} = useQuery('me', getMe, queryOptions)

    const {mutate: updateMe} = useMutation(mutator, {
        onSuccess: async (data) => {
            await queryCache.invalidateQueries('me')
        },
        ...mutateOptions
    })

    // TODO: Fix me type
    return {me, updateMe, isLoading}
}
