<script lang="ts">
	import { getTasks, getSession, updateTask } from '@taskratchet/sdk';
	import { onMount } from 'svelte';
	import Task from './task.svelte';
	import TaskModal from './TaskModal.svelte';

	export let page: 'next' | 'archive';

	let tasks: TaskType[] = [];
	let isAddOpen = false;
	let taskToCopy: TaskType | undefined;
let isEditing = false;
	let loading = true;
	let searchQuery = '';

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
					: new Date(task.due) <= cutoff,
			)
			.sort((a, b) =>
				page === 'next'
					? new Date(a.due).getTime() - new Date(b.due).getTime()
					: new Date(b.due).getTime() - new Date(a.due).getTime(),
			);
		loading = false;
	});
</script>

<div class="container">
	<h1>{page === 'next' ? 'Next' : 'Archived'} Tasks</h1>
	<input
		type="search"
		placeholder="Search tasks..."
		bind:value={searchQuery}
		class="search-input"
	/>
	{#if loading}
		<div class="loading">Loading tasks...</div>
	{/if}
	<ul>
		{#each tasks.filter(task => 
			task.task.toLowerCase().includes(searchQuery.toLowerCase())
		) as task}
			<Task
				{task}
				onCopy={(sourceTask) => {
					taskToCopy = sourceTask;
					isAddOpen = true;
				}}
				onEdit={(sourceTask) => {
					taskToCopy = sourceTask;
					isEditing = true;
					isAddOpen = true;
				}}
				onUncle={async (task) => {
					if (!task.id) return;
					const response = await updateTask(task.id, { uncle: true });
					if (response.ok) {
						// Refresh task list
						const allTasks = (await getTasks()) as TaskType[];
						const now = new Date();
						const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
						tasks = allTasks
							.filter((task) =>
								page === 'next'
									? new Date(task.due) > cutoff
									: new Date(task.due) <= cutoff,
							)
							.sort((a, b) =>
								page === 'next'
									? new Date(a.due).getTime() - new Date(b.due).getTime()
									: new Date(b.due).getTime() - new Date(a.due).getTime(),
							);
					}
				}}
			/>
		{/each}
	</ul>
</div>

<button 
    class="add-button" 
    on:click={() => {
        taskToCopy = undefined;
        isEditing = false;
        isAddOpen = true;
    }}
> + </button>

<TaskModal
	bind:isOpen={isAddOpen}
	mode={isEditing ? 'edit' : 'add'}
	sourceTask={taskToCopy}
	on:tasksAdded={async () => {
		const allTasks = (await getTasks()) as TaskType[];
		const now = new Date();
		const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
		tasks = allTasks
			.filter((task) =>
				page === 'next'
					? new Date(task.due) > cutoff
					: new Date(task.due) <= cutoff,
			)
			.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
	}}
/>

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

	.add-button {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		background: var(--primary);
		color: white;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.loading {
		text-align: center;
		padding: 2rem;
		color: var(--color);
	}
	.search-input {
		width: 100%;
		padding: 0.5rem;
		margin: 1rem 0;
		border: 1px solid var(--color);
		border-radius: 4px;
		background: var(--background);
		color: var(--color);
	}
</style>
