<script lang="ts">
	import { onMount } from 'svelte';
	import { getTasks } from '@taskratchet/sdk';
	import { user } from '$lib/authStore';

	type Task = {
		id: string;
		what: string;
		due: string | null;
		pnd: string | null;
	};

	let tasks: Task[] = [];
	let loading = true;
	let error: string | null = null;

	async function loadTasks() {
		try {
			loading = true;
			error = null;
			tasks = await getTasks();
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
		<h1 class="text-2xl font-bold mb-6">Your Tasks</h1>
		
		{#if loading}
			<div class="text-gray-600">Loading tasks...</div>
		{:else if error}
			<div class="text-red-600 bg-red-100 p-4 rounded-md">
				{error}
			</div>
		{:else if tasks.length === 0}
			<div class="text-gray-600">No tasks yet. Create one to get started!</div>
		{:else}
			<ul class="space-y-4">
				{#each tasks as task (task.id)}
					<li class="bg-white shadow rounded-lg p-4">
						<h3 class="font-medium">{task.what}</h3>
						{#if task.due}
							<p class="text-sm text-gray-600">
								Due: {new Date(task.due).toLocaleString()}
							</p>
						{/if}
						{#if task.pnd}
							<p class="text-sm text-gray-600">
								Penalty: ${task.pnd}
							</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<div class="text-center">
			<h1 class="text-3xl font-bold mb-4">Welcome to TaskRatchet</h1>
			<p class="text-gray-600 mb-8">
				Please <a href="/login" class="text-blue-600 hover:underline">log in</a> to see your tasks.
			</p>
		</div>
	{/if}
</div>
