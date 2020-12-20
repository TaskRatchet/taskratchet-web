import {useUpdateTask} from "./useUpdateTask";

export function useSetComplete() {
    const updateTask = useUpdateTask()

    return (id: number | string, complete: boolean) => updateTask(id, {
        complete: complete
    })
}
