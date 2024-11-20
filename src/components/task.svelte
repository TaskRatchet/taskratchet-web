<script lang="ts">
	import { updateTask } from '@taskratchet/sdk';
	import ConfirmModal from './ConfirmModal.svelte';
	import IconCopy from '~icons/material-symbols/content-copy-outline';
	import IconEdit from '~icons/material-symbols/edit-outline';
	import IconCharge from '~icons/material-symbols/payments-outline';
	import TaskEdit from './TaskEdit.svelte';

	let showUncleConfirm = false;
	let showEditModal = false;

	export let task: TaskType = {
		...task,
		status: task?.complete ? 'complete' : (task?.status || 'pending')
	};
	export let page: 'next' | 'archive';
	export let onCopy: (task: TaskType) => void;
	export let onEdit: (task: TaskType) => void;
	export let onUncle: (task: TaskType) => void;

	function formatDue(date: Date): string {
		return date.toLocaleString();
	}

	async function toggleComplete() {
		if (!task.id) return;
		await updateTask(task.id, { complete: !task.complete });
		task.complete = !task.complete;
		task.status = task.complete ? 'complete' : 'pending';
	}
</script>

<li>
	<div class="task-container">
		<div class="menu">
			<button on:click={() => onCopy(task)} title="Copy"><IconCopy /></button>
			{#if page === 'next'}
				<button
					on:click={() => (showEditModal = true)}
					disabled={!task.id || task.status !== 'pending'}
					title="Edit"><IconEdit /></button
				>
				<button
					on:click={() => {
						showUncleConfirm = true;
					}}
					disabled={task.status !== 'pending'}
					title="Charge immediately"><IconCharge /></button
				>
			{/if}
		</div>
		<input
			type="checkbox"
			checked={task.complete}
			disabled={!task.id || task.status === 'expired'}
			on:change={toggleComplete}
		/>
		<div class="task-content">
			<div class="task-text">{task.task}</div>
			<div class="task-details">
				${task.cents / 100} • due by {formatDue(new Date(task.due))}
			</div>
		</div>
	</div>
</li>

<ConfirmModal
	isOpen={showUncleConfirm}
	amount={task.cents / 100}
	onConfirm={() => {
		onUncle(task);
		showUncleConfirm = false;
	}}
	onCancel={() => (showUncleConfirm = false)}
/>

<TaskEdit
	{task}
	isOpen={showEditModal}
	on:close={() => {
		showEditModal = false;
		onEdit(task);
	}}
/>

<style>
	li {
		margin: 1rem 0;
	}

	.task-container {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.task-content {
		flex: 1;
	}

	.task-details {
		color: #666;
		font-size: 0.9em;
		margin-top: 0.25rem;
	}
	.menu {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.menu button {
		background: none;
		border: none;
		color: var(--color);
		opacity: 0.7;
		cursor: pointer;
	}

	.menu button:hover:not(:disabled) {
		opacity: 1;
	}

	.menu button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.task-container {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		position: relative;
		padding-right: 8rem; /* Make room for menu buttons */
	}

	.task-content {
		flex: 1;
		word-break: break-word; /* Allow text to wrap */
	}

	.task-details {
		color: #666;
		font-size: 0.9em;
		margin-top: 0.25rem;
	}
</style>
