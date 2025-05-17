<script lang="ts">
	import { addTask } from '@taskratchet/sdk';

	let {
		isOpen = false,
		onClose = () => {},
		onTaskAdded = () => {}
	}: {
		isOpen: boolean;
		onClose: () => void;
		onTaskAdded: () => void;
	} = $props();

	let task = $state('');
	let penaltyDollars = $state(0);
	let due = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	function handleClose() {
		// Reset form state
		task = '';
		penaltyDollars = 0;
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
				cents: penaltyDollars * 100,
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
	<!-- backdrop is mouse-only, not focusable -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="modal-backdrop bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black/80 p-4"
		onclick={(e) => {
			if (e.target === e.currentTarget) handleClose();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') handleClose();
		}}
	>
		<div class="w-full max-w-md rounded-lg bg-gray-800 shadow-xl">
			<div class="p-6">
				<h2 class="mb-4 text-xl font-semibold text-white">Create New Task</h2>

				{#if error}
					<div class="mb-4 rounded-md bg-red-100 p-4 text-red-700">
						{error}
					</div>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-4">
					<div>
						<label for="task" class="block text-sm font-medium text-gray-300">Task</label>
						<input
							type="text"
							id="task"
							bind:value={task}
							required
							class="mt-1 block w-full rounded-md border-gray-500 bg-gray-700 text-white shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							placeholder="What do you want to accomplish?"
						/>
					</div>

					<div>
						<label for="penaltyDollars" class="block text-sm font-medium text-gray-300"
							>Penalty Amount (whole $)</label
						>
						<input
							type="number"
							id="penaltyDollars"
							bind:value={penaltyDollars}
							min="0"
							step="1"
							required
							class="mt-1 block w-full rounded-md border-gray-500 bg-gray-700 text-white shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							placeholder="5"
						/>
					</div>

					<div>
						<label for="due" class="block text-sm font-medium text-gray-300">Due Date</label>
						<input
							type="datetime-local"
							id="due"
							bind:value={due}
							required
							class="mt-1 block w-full rounded-md border-gray-500 bg-gray-700 text-white shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						/>
					</div>

					<div class="mt-6 flex justify-end space-x-3">
						<button
							type="button"
							onclick={handleClose}
							class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gray-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
						>
							{loading ? 'Creating...' : 'Create Task'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
