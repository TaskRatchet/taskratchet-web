import {useMutation, useQueryClient} from "react-query";
import toaster from "../Toaster";
import {setComplete} from "./setComplete";

interface Context {
    previousTasks: Task[] | undefined
}

export function useSetComplete() {
    const queryClient = useQueryClient()

    // TODO: replace any type
    const {mutate} = useMutation(
        (variables: any) => {
            const {id, complete} = variables

            return setComplete(id, complete)
        }, {
            onMutate: async (variables): Promise<Context> => {
                // TODO: cancel queries

                const {id, complete} = variables
                const previousTasks: Task[] | undefined = queryClient.getQueryData('tasks')

                if (!previousTasks) return {previousTasks}

                const newTasks = previousTasks.map((t: Task) => (t.id === id) ? {...t, complete} : t)

                // console.log({variables, previousTasks, newTasks})

                queryClient.setQueryData('tasks', () => newTasks)

                return {previousTasks}
            },
            onError: (error: Error, variables, context) => {
                // console.log({m: 'handling error', variables, context})
                queryClient.setQueryData('tasks', (context as Context).previousTasks)
                toaster.send(error.toString())
            },
            onSettled: async () => {
                await queryClient.invalidateQueries('tasks')
            },
        }
    )

    return (id: string | number, complete: boolean) => {
        mutate({id, complete})
    }
}
