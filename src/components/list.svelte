<script lang="ts">
import { getTasks, getSession } from '@taskratchet/sdk';
import { onMount } from 'svelte';
import Task from './task.svelte';

export let page: 'next' | 'archive';

let tasks: TaskType[] = [];

onMount(async () => {
    const session = getSession();
    if (!session) {
        window.location.href = `/login?prev=${encodeURIComponent(window.location.pathname)}`;
        return;
    }

    const allTasks = (await getTasks()) as TaskType[];
    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    tasks = allTasks
        .filter((task) => 
            page === 'next' 
                ? new Date(task.due) > cutoff 
                : new Date(task.due) <= cutoff
        )
        .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
});
</script>

<div class="container">
    <h1>{page === 'next' ? 'Next' : 'Archived'} Tasks</h1>
    <ul>
        {#each tasks as task}
            <Task {task} />
        {/each}
    </ul>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
    }

    ul {
        list-style: none;
        padding: 0;
    }
</style>
