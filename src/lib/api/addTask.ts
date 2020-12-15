import {apiFetch} from "./apiFetch";

// Requires that user be authenticated.
export async function addTask(task: string, due: string, cents: number) {
    console.log({task, due, cents})
    return apiFetch(
        'me/tasks',
        true,
        'POST',
        {task, due, cents}
    );
}
