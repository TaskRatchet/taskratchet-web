<script lang="ts">
	import { addTask, getMe } from '@taskratchet/sdk';
	import { onMount } from 'svelte';
	import { formatDue } from '../lib/formatDue';

	export let isOpen = false;

	let task = '';
	let cents = 500;
	let due = getDefaultDue();
	let error = '';
	let timezone = '';

	onMount(async () => {
		const me = await getMe();
		timezone = me?.timezone;
	});

	function getDefaultDue() {
		const due = new Date();
		due.setDate(due.getDate() + 7);
		due.setHours(23);
		due.setMinutes(59);
		return formatDue(due);
	}

	async function onSubmit() {
		if (!task) {
			error = 'Task is required';
			return;
		}

		const lines = task.split(/\r?\n/);
		for (const line of lines) {
			await addTask({ task: line, due, cents });
		}
	}
</script>

{#if isOpen}
	<div class="modal">
		<div class="modal-content">
			<h2>Add Task</h2>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<div class="form">
				<label>
					Task
					<textarea
						bind:value={task}
						placeholder="Enter one or more tasks, one per line"
						rows="3"
					/>
				</label>

				<label>
					Stakes
					<div class="stakes-input">
						<span>$</span>
						<input
							type="number"
							on:input={(e) => (cents = e.currentTarget.valueAsNumber * 100)}
							value={cents / 100}
							min="1"
							step="1"
						/>
						<span>USD</span>
					</div>
				</label>

				<label>
					Due Date/Time
					<input type="datetime-local" bind:value={due} />
				</label>

				<div class="timezone">
					Timezone: {timezone}
				</div>

				<div class="buttons">
					<button on:click={() => (isOpen = false)}>Cancel</button>
					<button on:click={onSubmit}>Add</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		background: var(--background);
		color: var(--color);
		padding: 2rem;
		border-radius: 4px;
		width: 90%;
		max-width: 500px;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stakes-input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stakes-input input {
		width: 100px;
	}

	.buttons {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	.error {
		color: red;
		margin-bottom: 1rem;
	}

	input,
	textarea {
		background: var(--background);
		color: var(--color);
		border: 1px solid var(--color);
		padding: 0.5rem;
		border-radius: 4px;
	}
</style>
