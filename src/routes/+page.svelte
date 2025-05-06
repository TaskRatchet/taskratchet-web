<script lang="ts">
	import { onMount } from 'svelte';
	import { getTasks } from '@taskratchet/sdk';
	import { user } from '$lib/authStore';

	type Task = {
		id: string;
		cents: number;
		complete: boolean;
		due: string;
		due_timestamp: number;
		status: string;
		task: string;
		timezone: string;
	};

	let tasks: Task[] = [];
	let loading = true;
	let error: string | null = null;

	async function loadTasks() {
		try {
			loading = true;
			error = null;
			tasks = (await getTasks()) as Task[];
			console.log({ tasks });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load tasks';
			tasks = [];
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if ($user) {
			loadTasks();
		}
	});

	$: if ($user) {
		loadTasks();
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if $user}
		<h1 class="mb-6 text-2xl font-bold">Your Tasks</h1>

		{#if loading}
			<div class="text-gray-600">Loading tasks...</div>
		{:else if error}
			<div class="rounded-md bg-red-100 p-4 text-red-600">
				{error}
			</div>
		{:else if tasks.length === 0}
			<div class="text-gray-600">No tasks yet. Create one to get started!</div>
		{:else}
			<ul class="space-y-4">
				{#each tasks as task (task.id)}
					<li class="rounded-lg bg-white p-4 shadow">
						<h3 class="font-medium">{task.task}</h3>
						{#if task.due}
							<p class="text-sm text-gray-600">
								Due: {new Date(task.due).toLocaleString()}
							</p>
						{/if}
						{#if task.cents}
							<p class="text-sm text-gray-600">
								Penalty: ${task.cents / 100}
							</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<div class="text-center">
			<h1 class="mb-4 text-3xl font-bold">Welcome to TaskRatchet</h1>
			<p class="mb-8 text-gray-600">
				Please <a href="/login" class="text-blue-600 hover:underline">log in</a> to see your tasks.
			</p>
		</div>
	{/if}
</div>
