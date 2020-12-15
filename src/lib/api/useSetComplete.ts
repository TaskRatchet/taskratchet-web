import {useMutation, UseMutationResult, useQueryClient} from "react-query";
import toaster from "../Toaster";
import {setComplete} from "./setComplete";

export function useSetComplete() {
    const queryClient = useQueryClient()

    const {mutate} = useMutation(
        (variables: any) => {
            const {id, complete} = variables

            // console.log({m: 'completing task', id, complete})

            return setComplete(id, complete)
        },
        {
            onSettled: async () => {
                await queryClient.invalidateQueries('tasks')
            },
            onError: (error: Error) => {
                toaster.send(error.toString())
            }
        }
    )

    return (id: string | number, complete: boolean) => {
        mutate({id, complete})
    }
}
