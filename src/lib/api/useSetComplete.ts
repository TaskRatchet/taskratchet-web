import {useMutation, useQueryClient} from "react-query";
import toaster from "../Toaster";
import {setComplete} from "./setComplete";

interface Context {
    previousTasks: TaskType[] | undefined
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
                await queryClient.cancelQueries('tasks')

                const {id, complete} = variables
                const previousTasks: TaskType[] | undefined = queryClient.getQueryData('tasks')

                if (!previousTasks) return {previousTasks}

                const newTasks = previousTasks.map((t: TaskType) => (t.id === id) ? {...t, complete} : t)

                queryClient.setQueryData('tasks', () => newTasks)

                return {previousTasks}
            },
            onError: (error: Error, variables, context) => {
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
