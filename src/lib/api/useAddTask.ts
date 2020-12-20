import {useMutation, useQueryClient} from "react-query"
import {addTask} from "./addTask";
import toaster from "../Toaster";

interface Input {
    task: string,
    due: string,
    cents: number
}

export function useAddTask() {
    const queryClient = useQueryClient()

    const {mutate} = useMutation(({task, due, cents}: Input) => {
        return addTask(task, due, cents)
    }, {
        onMutate: async (newTask: Input) => {
            await queryClient.cancelQueries('tasks')

            const snapshot: TaskType[] | undefined = queryClient.getQueryData('tasks') || []

            queryClient.setQueryData('tasks', [...snapshot, {
                ...newTask
            }])

            return {snapshot}
        },
        onError: (error: Error, newTask: Input, context) => {
            const {snapshot = null} = context || {}
            if (snapshot !== null) {
                queryClient.setQueryData('tasks', snapshot)
            }
            toaster.send(error.toString())
        },
        onSettled: async () => {
            await queryClient.invalidateQueries('tasks')
        },
    })

    return (task: string, due: string, cents: number) => {
        mutate({task, due, cents})
    }
}
