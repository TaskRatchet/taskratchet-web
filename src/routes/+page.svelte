<script lang="ts">
	import { onMount } from 'svelte';
	import { getTasks, updateTask } from '@taskratchet/sdk';
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
	let currentView: 'next' | 'archive' = 'next';

	// Get start of today (midnight) for date comparisons
	$: today = new Date();
	$: {
		today.setHours(0, 0, 0, 0);
	}

	// Filter tasks into Next (due today or later) and Archive (due before today)
	$: nextTasks = tasks.filter(task => task.due_timestamp * 1000 >= today.getTime());
	$: archiveTasks = tasks.filter(task => task.due_timestamp * 1000 < today.getTime());
	$: displayedTasks = currentView === 'next' ? nextTasks : archiveTasks;

	async function loadTasks() {
		try {
			loading = true;
			error = null;
			tasks = (await getTasks()) as Task[];
			// Sort tasks by due date descending (latest first)
			tasks.sort((a, b) => b.due_timestamp - a.due_timestamp);
			console.log({ tasks });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load tasks';
			tasks = [];
		} finally {
			loading = false;
		}
	}

	async function handleToggleComplete(task: Task) {
		const originalComplete = task.complete;
		const taskIndex = tasks.findIndex(t => t.id === task.id);
		if (taskIndex === -1) return;

		// Optimistically update the UI
		tasks[taskIndex] = { ...task, complete: !task.complete };
		tasks = tasks; // Trigger reactivity

		try {
			await updateTask(task.id, { complete: !originalComplete });
		} catch (e) {
			console.error('Failed to update task:', e);
			// Revert the optimistic update on error
			tasks[taskIndex] = { ...task, complete: originalComplete };
			tasks = tasks; // Trigger reactivity
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
		<div class="mb-6">
			<h1 class="text-2xl font-bold mb-4">Your Tasks</h1>
			<div class="flex space-x-4 border-b border-gray-200">
				<button
					class="py-2 px-4 {currentView === 'next'
						? 'border-b-2 border-blue-500 text-blue-600'
						: 'text-gray-500 hover:text-gray-700'}"
					on:click={() => (currentView = 'next')}
				>
					Next
				</button>
				<button
					class="py-2 px-4 {currentView === 'archive'
						? 'border-b-2 border-blue-500 text-blue-600'
						: 'text-gray-500 hover:text-gray-700'}"
					on:click={() => (currentView = 'archive')}
				>
					Archive
				</button>
			</div>
		</div>

		{#if loading}
			<div class="text-gray-600">Loading tasks...</div>
		{:else if error}
			<div class="rounded-md bg-red-100 p-4 text-red-600">
				{error}
			</div>
		{:else if displayedTasks.length === 0}
			<div class="text-gray-600">
				{#if currentView === 'next'}
					No upcoming tasks. Create one to get started!
				{:else}
					No archived tasks.
				{/if}
			</div>
		{:else}
			<ul class="space-y-4">
				{#each displayedTasks as task (task.id)}
					<li class="rounded-lg bg-white p-4 shadow">
						<div class="flex items-start gap-4">
							<input
								type="checkbox"
								checked={task.complete}
								on:change={() => handleToggleComplete(task)}
								class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={currentView === 'archive'}
							/>
							<div>
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
							</div>
						</div>
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
