<script lang="ts">
    import { updateTask } from '@taskratchet/sdk';

    export let task: TaskType;
    export let disabled = false;

    let isConfirming = false;

    async function toggleComplete(event: Event) {
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
</script>

<input
    type="checkbox"
    checked={task.complete}
    {disabled}
    on:change={toggleComplete}
/>
