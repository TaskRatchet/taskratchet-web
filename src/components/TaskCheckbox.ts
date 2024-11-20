import { updateTask } from '@taskratchet/sdk';

type ToggleCompleteOptions = {
    event: Event;
    task: TaskType;
    isConfirming: boolean;
};

export async function toggleComplete({ event, task, isConfirming }: ToggleCompleteOptions) {
    if (!task.id) return;

    const checkbox = event.target as HTMLInputElement;
    const taskDue = new Date(task.due);
    const now = new Date();
    const isPastDue = taskDue < now;

    if (isPastDue && task.complete && !isConfirming) {
        checkbox.checked = true;
        const confirmed = confirm(
            'This task is past due. Marking it incomplete will require contacting support to undo. Continue?'
        );
        if (!confirmed) return;
        isConfirming = true;
    }

    await updateTask(task.id, { complete: !task.complete });
    task.complete = !task.complete;
    task.status = task.complete ? 'complete' : 'pending';
    isConfirming = false;
}
