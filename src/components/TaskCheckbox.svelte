<script lang="ts">
    import { toggleComplete } from './TaskCheckbox';

    export let task: TaskType;
    export let disabled = false;

    let isConfirming = false;

    async function handleChange(event: Event) {
        await toggleComplete({ event, task, isConfirming });
    }
</script>

<input
    type="checkbox"
    checked={task.complete}
    {disabled}
    on:change={handleChange}
/>
