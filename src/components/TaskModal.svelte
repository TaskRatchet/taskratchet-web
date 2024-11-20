<script lang="ts">
	import { addTask, getMe } from '@taskratchet/sdk';
	import { onMount, createEventDispatcher } from 'svelte';
	import { formatDue } from '../lib/formatDue';

	const dispatch = createEventDispatcher();

	export let isOpen = false;
	export let mode: 'add' | 'edit' = 'add';
	export let sourceTask: TaskType | undefined = undefined;
	export let onSave: (
		task: TaskType,
	) => Promise<Response | string | void> | string | void;

	let task = '';
	let cents = 500;
	let due = getDefaultDue();
	let error = '';
	let success = '';
	let timezone = '';

	$: {
		if (!isOpen) {
			task = '';
			cents = 500;
			error = '';
			success = '';
		} else if (mode === 'edit' && sourceTask) {
			task = sourceTask.task;
			cents = sourceTask.cents;
		}
	}

	onMount(async () => {
		const me = await getMe();
		timezone = me?.timezone;
	});

	function getDefaultDue() {
		const due = new Date();
		due.setDate(due.getDate() + 7);
		due.setHours(23);
		due.setMinutes(59);
		due.setSeconds(0);
		due.setMilliseconds(0);
		const offset = due.getTimezoneOffset();
		due.setMinutes(due.getMinutes() - offset);
		return due.toISOString().slice(0, 16);
	}

	async function onSubmit() {
		if (!task) {
			error = 'Task is required';
			return;
		}

		try {
			const dueDate = new Date(due);
			const formattedDue = formatDue(dueDate);
			const taskData = { task, due: formattedDue, cents } as TaskType;

			const result = await onSave(taskData);

			if (typeof result === 'string') {
				error = result;
				return;
			}

			if (result && !result.ok) {
				error = await result.text();
				return;
			}

			success =
				mode === 'edit'
					? 'Task updated successfully'
					: 'Tasks added successfully';
			dispatch('close');
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to save task';
		}
	}
</script>

{#if isOpen}
	<div class="modal">
		<div class="modal-content">
			<h2>{mode === 'edit' ? 'Edit Task' : 'Add Task'}</h2>

			{#if error}
				<div class="error">{error}</div>
			{/if}
			{#if success}
				<div class="success">{success}</div>
			{/if}

			<div class="form">
				<label>
					Task
					<textarea
						bind:value={task}
						placeholder="Enter one or more tasks, one per line"
						rows="3"
						disabled={mode === 'edit'}
					></textarea>
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
					<button on:click={() => dispatch('close')}>Cancel</button>
					<button on:click={onSubmit}>{mode === 'edit' ? 'Save' : 'Add'}</button
					>
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
		z-index: 1000;
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

	.success {
		color: green;
		margin-bottom: 1rem;
	}

	input,
	textarea,
	button {
		background: var(--background);
		color: var(--color);
		border: 1px solid var(--color);
		padding: 0.5rem;
		border-radius: 4px;
	}

	button {
		cursor: pointer;
		min-width: 80px;
	}

	button:hover {
		background: var(--primary);
		border-color: var(--primary);
		color: white;
	}
</style>
