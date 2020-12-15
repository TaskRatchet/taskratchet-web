import {useMutation, useQueryClient} from "react-query"
import {addTask} from "./addTask";
import toaster from "../Toaster";

export function useAddTask() {
    const queryClient = useQueryClient()

    // TODO: replace any type
    const {mutate} = useMutation((variables: any) => {
        const {task, due, cents} = variables

        return addTask(task, due, cents)
    }, {
        onSettled: async () => {
            await queryClient.invalidateQueries('tasks')
        },
        onError: (error: Error) => {
            toaster.send(error.toString())
        }
    })

    return (task: string, due: string, cents: number) => {
        mutate({task, due, cents})
    }
}
