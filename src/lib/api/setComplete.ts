import {apiFetch} from "./apiFetch";

// Requires that user be authenticated.
export function setComplete(taskId: number | string, complete: boolean) {
    return apiFetch(
        'me/tasks/' + taskId,
        true,
        'PUT',
        {
            'complete': complete
        }
    );
}
