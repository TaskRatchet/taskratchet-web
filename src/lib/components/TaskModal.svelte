<script lang="ts">
	import { addTask } from '@taskratchet/sdk';

	export let isOpen = false;
	export let onClose = () => {};
	export let onTaskAdded = () => {};

	let task = '';
	let cents = 0;
	let due = '';
	let loading = false;
	let error: string | null = null;

	function handleClose() {
		// Reset form state
		task = '';
		cents = 0;
		due = '';
		error = null;
		onClose();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		error = null;

		try {
			await addTask({
				task,
				cents,
				due: new Date(due).toISOString()
			});
			handleClose();
			onTaskAdded();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to create task';
		} finally {
			loading = false;
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-lg shadow-xl w-full max-w-md">
			<div class="p-6">
				<h2 class="text-xl font-semibold mb-4">Create New Task</h2>

				{#if error}
					<div class="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
						{error}
					</div>
				{/if}

				<form on:submit={handleSubmit} class="space-y-4">
					<div>
						<label for="task" class="block text-sm font-medium text-gray-700">Task</label>
						<input
							type="text"
							id="task"
							bind:value={task}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							placeholder="What do you want to accomplish?"
						/>
					</div>

					<div>
						<label for="cents" class="block text-sm font-medium text-gray-700">Penalty Amount ($)</label>
						<input
							type="number"
							id="cents"
							bind:value={cents}
							min="0"
							step="0.01"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							placeholder="5.00"
						/>
					</div>

					<div>
						<label for="due" class="block text-sm font-medium text-gray-700">Due Date</label>
						<input
							type="datetime-local"
							id="due"
							bind:value={due}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						/>
					</div>

					<div class="flex justify-end space-x-3 mt-6">
						<button
							type="button"
							on:click={handleClose}
							class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{loading ? 'Creating...' : 'Create Task'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}